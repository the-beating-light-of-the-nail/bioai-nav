import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { CATEGORIES, SITE } from './data/categories'

// BioAI Nav — Nuxt 3 SSG + Cloudflare Workers 静态资产（en 无前缀 / zh 前缀双语）
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

const enRoutes = [
  '/',
  '/about',
  '/submit',
  '/search',
  '/tags',
  ...CATEGORIES.map((c) => `/${c.slug}`),
  ...subRoutes,
  ...detailRoutes,
  ...tagRoutes,
]

// 双语种子：en 无前缀，zh 加 /zh 前缀（prefix_except_default 策略）
const zhRoutes = enRoutes.map((r) => (r === '/' ? '/zh' : `/zh${r}`))

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,

  modules: ['@nuxtjs/i18n'],

  css: ['@fontsource-variable/inter', '~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: SITE.url,
      siteName: SITE.name,
      githubRepo: SITE.githubRepo,
    },
  },

  i18n: {
    baseUrl: SITE.url,
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // SEO 站不做语言自动跳转，用户手动切换（页头语言切换器）
    detectBrowserLanguage: false,
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
      script: [
        {
          // Microsoft Clarity 行为分析（会话回放/热力图），项目 ID 与 clarity.ms 后台一致
          innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/yeytmuf10f";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","yeytmuf10f");`,
        },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [
        ...enRoutes,
        ...zhRoutes,
        '/sitemap.xml',
        '/zh/sitemap.xml',
        '/robots.txt',
      ],
    },
  },

  experimental: {
    payloadExtraction: false,
  },
})
