import { SITE } from '~/data/categories'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string) || SITE.url
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
