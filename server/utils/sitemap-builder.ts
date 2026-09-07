import { CATEGORIES, SITE } from '~/data/categories'
import allResources from '~/data/generated/all-resources.json'

// 分语言 sitemap（en 版；zh 版见 server/routes/zh/sitemap.xml.ts）。
// 与预渲染种子同一数据源；/search 是 noindex 页，不进 sitemap。
// 注意：直接静态导入 split-resources.mjs 产出的 all-resources.json，
// 不 import data/load.ts——nitro 预渲染路由块不支持 import.meta.glob。
const SUBCAT_PAGE_MIN = 3
const TAG_PAGE_MIN = 4

interface RawResource {
  slug: string
  category: string
  subcategory?: string | null
  tags?: string[]
  status?: string
}

export function buildSitemap(event: any, locale: 'en' | 'zh') {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string) || SITE.url
  const prefix = locale === 'zh' ? '/zh' : ''
  const lastmod = new Date().toISOString().slice(0, 10)
  const all = (allResources as RawResource[]).filter((r) => r.status !== 'retired')

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: `${prefix}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${prefix}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${prefix}/submit`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${prefix}/tags`, priority: '0.4', changefreq: 'weekly' },
  ]

  for (const c of CATEGORIES) {
    urls.push({ loc: `${prefix}/${c.slug}`, priority: '0.9', changefreq: 'weekly' })
    if (c.virtual) continue
    const counts = new Map<string, number>()
    for (const r of all) {
      if (r.category !== c.slug || !r.subcategory) continue
      counts.set(r.subcategory, (counts.get(r.subcategory) || 0) + 1)
    }
    for (const [sub, n] of counts) {
      if (n >= SUBCAT_PAGE_MIN) urls.push({ loc: `${prefix}/${c.slug}/${sub}`, priority: '0.7', changefreq: 'weekly' })
    }
  }

  for (const r of all) {
    urls.push({ loc: `${prefix}/${r.category}/${r.slug}`, priority: '0.6', changefreq: 'monthly' })
  }

  const tagCounts = new Map<string, number>()
  for (const r of all) for (const t of r.tags || []) tagCounts.set(t.toLowerCase(), (tagCounts.get(t.toLowerCase()) || 0) + 1)
  for (const [t, n] of tagCounts) {
    if (n >= TAG_PAGE_MIN) urls.push({ loc: `${prefix}/tags/${t}`, priority: '0.4', changefreq: 'weekly' })
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${siteUrl}${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
}
