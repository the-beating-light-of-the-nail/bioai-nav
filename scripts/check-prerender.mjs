#!/usr/bin/env node
// generate 之后的质量闸门：对照 data/resources 逐页检查 .output/public 产物。
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

const expected = []
const push = (route) => expected.push(route)
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

function routeToFile(route) {
  if (route === '/') return resolve(outDir, 'index.html')
  return resolve(outDir, route.replace(/^\//, ''), 'index.html')
}

const missing = expected.filter((r) => !existsSync(routeToFile(r)))
const extras = ['/sitemap.xml', '/robots.txt', '/404.html'].filter((f) => !existsSync(resolve(outDir, f.replace(/^\//, ''))))

// sitemap 必须包含全部详情路由
const sitemap = existsSync(resolve(outDir, 'sitemap.xml'))
  ? readFileSync(resolve(outDir, 'sitemap.xml'), 'utf8')
  : ''
const sitemapMissing = all
  .map((r) => `/${r.category}/${r.slug}`)
  .filter((r) => !sitemap.includes(`<loc>https://bioainav.aiworkagent.org${r}</loc>`))

console.log(`资源 ${all.length} 个 · 预期页面 ${expected.length} 个`)
if (missing.length) {
  console.error(`缺失页面 ${missing.length} 个:`)
  for (const m of missing.slice(0, 30)) console.error('  - ' + m)
  if (missing.length > 30) console.error(`  … 以及另外 ${missing.length - 30} 个`)
}
if (extras.length) {
  console.error(`缺失辅助文件: ${extras.join(', ')}`)
}
if (sitemapMissing.length) {
  console.error(`sitemap 缺 ${sitemapMissing.length} 个详情路由（前 10: ${sitemapMissing.slice(0, 10).join(', ')}）`)
}
if (missing.length || extras.length || sitemapMissing.length) {
  console.error('CHECK FAILED')
  process.exit(1)
}
console.log('CHECK PASSED ✓')
