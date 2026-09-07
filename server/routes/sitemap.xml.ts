import { buildSitemap } from '~/server/utils/sitemap-builder'

// en 版 sitemap（zh 版见 server/routes/zh/sitemap.xml.ts）
export default defineEventHandler((event) => buildSitemap(event, 'en'))
