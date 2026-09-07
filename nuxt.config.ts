import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { CATEGORIES, SITE } from './data/categories'

// BioAI Nav — Nuxt 3 SSG + Cloudflare Workers 静态资产
// 预渲染种子从 data/resources/**/*.json 显式计算（不依赖 crawlLinks），
// 与 scripts/check-prerender.mjs、server/routes/sitemap.xml.ts 同一数据源。

const SUBCAT_PAGE_MIN = 3 // 子类目聚合页门槛：≥3 个资源才出页（避免薄页面）
const TAG_PAGE_MIN = 4 // 标签聚合页门槛

interface RawResource {
  slug: string
  category: string
  subcategory?: string | null
  tags?: string[]
  status?: string
}

function loadAllResources(): RawResource[] {
  const dir = './data/resources'
  if (!existsSync(dir)) return []
  const out: RawResource[] = []
  for (const cat of readdirSync(dir, { withFileTypes: true })) {
    if (!cat.isDirectory() || cat.name === 'github') continue
    for (const f of readdirSync(`${dir}/${cat.name}`)) {
      if (!f.endsWith('.json')) continue
      const r = JSON.parse(readFileSync(`${dir}/${cat.name}/${f}`, 'utf8')) as RawResource
      out.push(r)
    }
  }
  return out.filter((r) => r.status !== 'retired')
}

const all = loadAllResources()

const detailRoutes = all.map((r) => `/${r.category}/${r.slug}`)

const subRoutes: string[] = []
for (const c of CATEGORIES) {
  if (c.virtual) continue
  const counts = new Map<string, number>()
  for (const r of all) {
    if (r.category !== c.slug || !r.subcategory) continue
    counts.set(r.subcategory, (counts.get(r.subcategory) || 0) + 1)
  }
  for (const [sub, n] of counts) if (n >= SUBCAT_PAGE_MIN) subRoutes.push(`/${c.slug}/${sub}`)
}

const tagCounts = new Map<string, number>()
for (const r of all) for (const t of r.tags || []) tagCounts.set(t.toLowerCase(), (tagCounts.get(t.toLowerCase()) || 0) + 1)
const tagRoutes = [...tagCounts.entries()]
  .filter(([, n]) => n >= TAG_PAGE_MIN)
  .map(([slug]) => `/tags/${slug}`)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,

  css: ['@fontsource-variable/inter', '~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: SITE.url,
      siteName: SITE.name,
      githubRepo: SITE.githubRepo,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s',
      title: 'BioAI Nav — The Navigation Hub for AI in Biology & Biotech',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#175d8c' },
        { name: 'description', content: SITE.description },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/about',
        '/submit',
        '/search',
        '/tags',
        ...CATEGORIES.map((c) => `/${c.slug}`),
        ...subRoutes,
        ...detailRoutes,
        ...tagRoutes,
        '/sitemap.xml',
        '/robots.txt',
      ],
    },
  },

  experimental: {
    payloadExtraction: false,
  },
})
