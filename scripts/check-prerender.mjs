#!/usr/bin/env node
// generate 之后的质量闸门：对照 data/resources 逐页检查 .output/public 产物（en + zh 双语）。
// 用法：node scripts/check-prerender.mjs（npm run check）
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(root, 'data/resources')
const outDir = resolve(root, '.output/public')

const SUBCAT_PAGE_MIN = 3
const TAG_PAGE_MIN = 4

const CATEGORIES = [
  'directories', 'skills', 'awesome', 'agents', 'tools',
  'models', 'platforms', 'github', 'datasets', 'learning',
]

if (!existsSync(outDir)) {
  console.error('缺少 .output/public —— 先跑 npm run generate')
  process.exit(1)
}

const all = existsSync(dataDir)
  ? readdirSync(dataDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== 'github')
      .flatMap((d) =>
        readdirSync(resolve(dataDir, d.name))
          .filter((f) => f.endsWith('.json'))
          .map((f) => JSON.parse(readFileSync(resolve(dataDir, d.name, f), 'utf8'))),
      )
  : []

const enExpected = []
const push = (route) => enExpected.push(route)
push('/')
push('/about')
push('/submit')
push('/search')
push('/tags')
for (const c of CATEGORIES) push(`/${c}`)

const subCounts = new Map()
const tagCounts = new Map()
for (const r of all) {
  push(`/${r.category}/${r.slug}`)
  if (r.subcategory) {
    const k = `${r.category}/${r.subcategory}`
    subCounts.set(k, (subCounts.get(k) || 0) + 1)
  }
  for (const t of r.tags || []) tagCounts.set(t.toLowerCase(), (tagCounts.get(t.toLowerCase()) || 0) + 1)
}
for (const [k, n] of subCounts) if (n >= SUBCAT_PAGE_MIN) push(`/${k}`)
for (const [t, n] of tagCounts) if (n >= TAG_PAGE_MIN) push(`/tags/${t}`)

// zh 前缀镜像
const zhExpected = enExpected.map((r) => (r === '/' ? '/zh' : `/zh${r}`))
const expected = [...enExpected, ...zhExpected]

function routeToFile(route) {
  if (route === '/') return resolve(outDir, 'index.html')
  if (route === '/zh') return resolve(outDir, 'zh/index.html')
  return resolve(outDir, route.replace(/^\//, ''), 'index.html')
}

const missing = expected.filter((r) => !existsSync(routeToFile(r)))
const extras = ['/sitemap.xml', '/robots.txt', '/404.html', '/zh/sitemap.xml'].filter((f) => !existsSync(resolve(outDir, f.replace(/^\//, ''))))

// 两个 sitemap 必须各自包含全部详情路由
const enSitemap = existsSync(resolve(outDir, 'sitemap.xml')) ? readFileSync(resolve(outDir, 'sitemap.xml'), 'utf8') : ''
const zhSitemap = existsSync(resolve(outDir, 'zh/sitemap.xml')) ? readFileSync(resolve(outDir, 'zh/sitemap.xml'), 'utf8') : ''
const enMissing = all.map((r) => `/${r.category}/${r.slug}`).filter((r) => !enSitemap.includes(`<loc>https://bioainav.aiworkagent.org${r}</loc>`))
const zhMissing = all.map((r) => `/${r.category}/${r.slug}`).filter((r) => !zhSitemap.includes(`<loc>https://bioainav.aiworkagent.org/zh${r}</loc>`))

console.log(`资源 ${all.length} 个 · 预期页面 ${expected.length} 个（en ${enExpected.length} + zh ${zhExpected.length}）`)
if (missing.length) {
  console.error(`缺失页面 ${missing.length} 个:`)
  for (const m of missing.slice(0, 30)) console.error('  - ' + m)
  if (missing.length > 30) console.error(`  … 以及另外 ${missing.length - 30} 个`)
}
if (extras.length) console.error(`缺失辅助文件: ${extras.join(', ')}`)
if (enMissing.length) console.error(`en sitemap 缺 ${enMissing.length} 个详情路由（前 10: ${enMissing.slice(0, 10).join(', ')}）`)
if (zhMissing.length) console.error(`zh sitemap 缺 ${zhMissing.length} 个详情路由（前 10: ${zhMissing.slice(0, 10).join(', ')}）`)
if (missing.length || extras.length || enMissing.length || zhMissing.length) {
  console.error('CHECK FAILED')
  process.exit(1)
}
console.log('CHECK PASSED ✓')
