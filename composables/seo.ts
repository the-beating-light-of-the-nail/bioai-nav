// SEO 组合式函数：canonical / OG / Twitter / JSON-LD 统一出口。
// canonical 绝不硬编码在页面里，一律走 runtimeConfig.public.siteUrl（默认正式域名）。
import { SITE, TYPE_LABELS } from '~/data/categories'

export function useSiteUrl(): string {
  const config = useRuntimeConfig()
  return (config.public.siteUrl as string) || SITE.url
}

export function usePageSeo(opts: {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
}) {
  const siteUrl = useSiteUrl()
  const canonical = siteUrl + opts.path
  useHead({ title: opts.title })
  useSeoMeta({
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogSiteName: SITE.name,
    ogType: opts.ogType || 'website',
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
  })
  useHead({ link: [{ rel: 'canonical', href: canonical }] })
}

// 页面级 JSON-LD：一次一条 script 标签，多调几次即可挂多组结构化数据
export function useJsonLd(data: unknown) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data).replace(/</g, '\\u003c'),
      },
    ],
  })
}

export interface Crumb {
  name: string
  path: string
}

export function useBreadcrumbJsonLd(crumbs: Crumb[]) {
  const siteUrl = useSiteUrl()
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: siteUrl + c.path,
    })),
  })
}

export function websiteJsonLd() {
  const siteUrl = useSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: 'BioAI Navigation',
    url: siteUrl,
    description: SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function collectionJsonLd(opts: { name: string; description: string; path: string; resources: { name: string; slug: string; category: string }[] }) {
  const siteUrl = useSiteUrl()
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: opts.name,
      description: opts.description,
      url: siteUrl + opts.path,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      numberOfItems: opts.resources.length,
      itemListElement: opts.resources.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.name,
        url: `${siteUrl}/${r.category}/${r.slug}`,
      })),
    },
  ]
}

// 资源 type → schema.org 主实体类型
const SCHEMA_ENTITY: Record<string, string> = {
  tool: 'SoftwareApplication',
  model: 'SoftwareApplication',
  agent: 'SoftwareApplication',
  platform: 'Organization',
  'skill-library': 'CreativeWork',
  'awesome-list': 'CreativeWork',
  'mcp-server': 'SoftwareApplication',
  directory: 'WebSite',
  dataset: 'Dataset',
  course: 'Course',
  book: 'Book',
  tutorial: 'TechArticle',
  docs: 'TechArticle',
  paper: 'ScholarlyArticle',
  lecture: 'LearningResource',
}

export function resourceJsonLd(r: {
  name: string
  description: string
  url: string
  github?: string | null
  tags: string[]
  type: string
  publisher?: string | null
  license?: string | null
}) {
  const entity = SCHEMA_ENTITY[r.type] || 'CreativeWork'
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': entity,
    name: r.name,
    description: r.description,
    url: r.url,
    keywords: (r.tags || []).join(', '),
  }
  if (r.github) node.sameAs = [r.github]
  if (r.publisher) node.publisher = { '@type': 'Organization', name: r.publisher }
  if (r.license) node.license = r.license
  return node
}

export function typeLabel(type: string): string {
  return TYPE_LABELS[type] || 'Resource'
}

// 标签 slug → 展示名（小写词表 → Title Case，缩写词特判）
const TAG_ACRONYMS: Record<string, string> = {
  ai4science: 'AI4Science',
  mcp: 'MCP',
  esm: 'ESM',
  dna: 'DNA',
  rna: 'RNA',
  llm: 'LLM',
  llms: 'LLMs',
  cli: 'CLI',
  api: 'API',
  nlp: 'NLP',
  'single-cell': 'Single Cell',
  'drug-discovery': 'Drug Discovery',
  'protein-design': 'Protein Design',
  'protein-language-model': 'Protein Language Models',
  'awesome-list': 'Awesome Lists',
  'agent-skills': 'Agent Skills',
}

export function tagLabel(slug: string): string {
  const key = slug.toLowerCase()
  if (TAG_ACRONYMS[key]) return TAG_ACRONYMS[key]
  return key
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatStars(stars?: number | null): string | null {
  if (!stars) return null
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(stars)
}
