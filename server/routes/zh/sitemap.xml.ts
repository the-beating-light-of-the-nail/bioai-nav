import { buildSitemap } from '~/server/utils/sitemap-builder'

// 中文版 sitemap：/zh/sitemap.xml（robots.txt 中与英文版并列声明）
export default defineEventHandler((event) => buildSitemap(event, 'zh'))
