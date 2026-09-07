import { SITE } from '~/data/categories'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string) || SITE.url
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /zh/search\n\nSitemap: ${siteUrl}/sitemap.xml\nSitemap: ${siteUrl}/zh/sitemap.xml\n`
})
