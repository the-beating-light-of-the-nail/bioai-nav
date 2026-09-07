// IndexNow 批量提交：从构建产物 sitemap 抽取全部页面 URL，批量 POST 到 api.indexnow.org。
// 前置条件：npm run generate 已跑（读 .output/public/sitemap.xml 与 /zh/sitemap.xml），
// 且 key 文件已随部署上线（否则 API 返回 403 key not valid）。
// 用法：node scripts/indexnow.mjs [--dry]（--dry 只统计不提交）
import { readFileSync, readdirSync } from 'node:fs'

const DRY = process.argv.includes('--dry')

// 站点域名唯一来源是 data/categories.ts 的 SITE.url，这里正则提取，避免第二处硬编码
const SITE_URL = /url:\s*'([^']+)'/.exec(readFileSync('data/categories.ts', 'utf8'))[1]

// key 文件即 public/ 下的 IndexNow key txt（文件名 = key 内容）；公开信息，刻意入库
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!keyFile) {
  console.error('未在 public/ 找到 IndexNow key 文件（^[0-9a-f]{32}\\.txt$）')
  process.exit(1)
}
const KEY = keyFile.replace('.txt', '')
const KEY_LOCATION = `${SITE_URL}/${keyFile}`

// 从两个分语言 sitemap 抽 URL（排除 sitemap 自身与任何 xml）
const urls = []
for (const sm of ['sitemap.xml', 'zh/sitemap.xml']) {
  const xml = readFileSync(`.output/public/${sm}`, 'utf8')
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = m[1]
    if (!u.endsWith('.xml')) urls.push(u)
  }
}
const unique = [...new Set(urls)]

console.log(`站点 ${SITE_URL} · key ${KEY.slice(0, 8)}… · 待提交 ${unique.length} 个 URL（en+zh）`)
if (DRY) {
  console.log('首尾示例：')
  console.log(' ', unique.slice(0, 3).join('\n  '))
  console.log(' ', unique.slice(-2).join('\n  '))
  process.exit(0)
}

// IndexNow 单次上限 10000 URL，336 页一条请求即可；按 1000 分批防御未来规模
const BATCH = 1000
let ok = 0
for (let i = 0; i < unique.length; i += BATCH) {
  const batch = unique.slice(i, i + BATCH)
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
  })
  console.log(`批次 ${i / BATCH + 1}（${batch.length} URL）→ HTTP ${res.status}${res.status === 200 ? ' Ok' : ' ' + (await res.text()).slice(0, 120)}`)
  if (res.status === 200 || res.status === 202) ok += batch.length
}
console.log(`完成：${ok}/${unique.length} URL 已提交到 IndexNow（Bing/Yandex/Naver/Seznam 等共用此协议）`)
