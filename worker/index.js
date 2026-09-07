// BioAI Nav Worker —— 静态资产 + 两个小 API
// 部署：npm run deploy（nuxt generate → .output/public → wrangler deploy）
//
//   POST /api/submit        公开投稿：Upstash RPUSH 暂存 + 每 IP 每小时限频（fail-open）
//   GET  /api/submissions   管理员拉取待审队列（Bearer BIOAINAV_ADMIN_TOKEN，?clear=1 清空）
//
// 数据都进共享 Upstash 实例，key 一律带 bioainav: 前缀；IP 只存 HMAC 哈希不存原文。

const QUEUE_KEY = 'bioainav:submissions'
const RATE_KEY = 'bioainav:rl'
const RATE_LIMIT = 5 // 次/小时/IP

const CATEGORIES = new Set([
  'directories', 'skills', 'awesome', 'agents', 'tools',
  'models', 'platforms', 'datasets', 'learning', 'github', 'other',
])

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    try {
      if (url.pathname.startsWith('/api/')) return await handleApi(request, env, url)
      return env.ASSETS.fetch(request)
    } catch (e) {
      return json({ error: 'internal error' }, 500)
    }
  },
}

async function handleApi(request, env, url) {
  try {
    if (url.pathname === '/api/submit' && request.method === 'POST') return handleSubmit(request, env)
    if (url.pathname === '/api/submissions' && request.method === 'GET') return handleReadQueue(request, env, url)
    return json({ error: 'not found' }, 404)
  } catch (e) {
    return json({ error: 'internal error' }, 500)
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

async function upstash(env, path) {
  const base = env.UPSTASH_REDIS_REST_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN
  const res = await fetch(`${base}/${path}`, { headers: { authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  return res.json()
}

async function hmacHex(secret, text) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function clientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0'
  )
}

async function handleSubmit(request, env) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid JSON body' }, 400)
  }

  const str = (v) => (typeof v === 'string' ? v.trim() : '')
  const item = {
    name: str(body.name),
    url: str(body.url),
    github: str(body.github),
    category: str(body.category),
    description: str(body.description),
    submitter: str(body.submitter),
    email: str(body.email),
  }

  // 蜜罐：正常用户看不见该字段，有值即机器人
  if (str(body.company)) return json({ ok: true })

  if (item.name.length < 2 || item.name.length > 100) return json({ error: 'name must be 2-100 characters' }, 400)
  try {
    const u = new URL(item.url)
    if (!/^https?:$/.test(u.protocol)) throw new Error()
  } catch {
    return json({ error: 'url must be a valid http(s) URL' }, 400)
  }
  if (item.github && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(item.github)) {
    return json({ error: 'github must be a repository URL' }, 400)
  }
  if (!CATEGORIES.has(item.category)) return json({ error: 'unknown category' }, 400)
  if (item.description.length < 10 || item.description.length > 600) {
    return json({ error: 'description must be 10-600 characters' }, 400)
  }
  if (item.submitter.length > 60) return json({ error: 'submitter name too long' }, 400)
  if (item.email && (item.email.length > 120 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(item.email))) {
    return json({ error: 'invalid email' }, 400)
  }

  const ip = clientIp(request)
  const ipHash = await hmacHex(env.BIOAINAV_ADMIN_TOKEN || 'fallback', ip)

  // 每 IP 每小时限频（Redis 挂了 fail-open 放行，不影响投稿）
  try {
    const bucket = `${RATE_KEY}:${ipHash.slice(0, 20)}:${new Date().toISOString().slice(0, 13)}`
    const counted = await upstash(env, `incr/${bucket}`)
    if (counted.result === 1) await upstash(env, `expire/${bucket}/3600`)
    if (counted.result > RATE_LIMIT) return json({ error: 'too many submissions, try again later' }, 429)
  } catch {
    // fail-open
  }

  const payload = JSON.stringify({ ...item, ip: ipHash, ts: Date.now() })
  await upstash(env, `rpush/${QUEUE_KEY}/${encodeURIComponent(payload)}`)

  return json({ ok: true })
}

async function handleReadQueue(request, env, url) {
  const auth = request.headers.get('authorization') || ''
  if (!env.BIOAINAV_ADMIN_TOKEN || auth !== `Bearer ${env.BIOAINAV_ADMIN_TOKEN}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  if (url.searchParams.get('clear') === '1') {
    await upstash(env, `del/${QUEUE_KEY}`)
    return json({ ok: true, cleared: true })
  }

  const take = Math.min(parseInt(url.searchParams.get('take') || '200', 10) || 200, 500)
  // 注意：Upstash 路径式 API 不接受 "-" 负索引段，LRANGE 一律用 0..take-1 再反转
  const res = await upstash(env, `lrange/${QUEUE_KEY}/0/${take - 1}`)
  const items = (res.result || [])
    .map((s) => {
      try { return JSON.parse(s) } catch { return { raw: s } }
    })
    .reverse()
  return json({ ok: true, count: items.length, items })
}
