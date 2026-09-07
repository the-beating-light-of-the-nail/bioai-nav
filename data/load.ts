// 资源数据装载：data/resources/<category>/<slug>.json，一文件一资源。
// 由 Vite import.meta.glob 全量内联——SSG 预渲染与浏览器端搜索/筛选共用同一份内存数据，
// 新增资源 = 新增一个 JSON 文件，无需改任何代码。
import { CATEGORY_SLUGS } from './categories'

export interface Resource {
  name: string
  slug: string
  category: string // 9 个真实分类；github 为虚拟视图，禁止出现在数据文件里
  subcategory?: string | null
  type: string
  description: string
  longDescription?: string | string[]
  url: string
  github?: string | null
  tags: string[]
  openSource: boolean
  agentSupport: boolean
  mcp: boolean
  openclaw: boolean
  featured?: boolean
  status?: string
  publisher?: string | null
  language?: string | null
  stars?: number | null
  license?: string | null
  addedAt?: string
}

// 子类目聚合页与标签聚合页的生成门槛——低于它宁可不出页（避免薄页面）
export const SUBCAT_PAGE_MIN = 3
export const TAG_PAGE_MIN = 4

const modules = import.meta.glob('./resources/**/*.json', { eager: true }) as Record<
  string,
  { default: Resource }
>

export const dataIssues: string[] = []
const seenSlugs = new Set<string>()

export const resources: Resource[] = Object.entries(modules)
  .map(([path, mod]) => {
    const r = mod.default
    const m = path.match(/\.\/resources\/([^/]+)\/([^/]+)\.json$/)
    if (!m) {
      dataIssues.push(`bad data path: ${path}`)
      return r
    }
    if (m[1] !== r.category) dataIssues.push(`${path}: category "${r.category}" != 目录 "${m[1]}"`)
    if (m[2] !== r.slug) dataIssues.push(`${path}: slug "${r.slug}" != 文件名 "${m[2]}"`)
    if (!CATEGORY_SLUGS.includes(r.category) || r.category === 'github')
      dataIssues.push(`${path}: 非法 category "${r.category}"（github 是虚拟视图）`)
    if (!r.url || !/^https?:\/\//.test(r.url)) dataIssues.push(`${path}: 缺少合法 url`)
    const key = `${r.category}/${r.slug}`
    if (seenSlugs.has(key)) dataIssues.push(`重复 slug: ${key}`)
    seenSlugs.add(key)
    return r
  })
  .filter((r) => r && r.status !== 'retired')
  .sort((a, b) => {
    if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1
    return a.name.localeCompare(b.name)
  })

export function byCategory(category: string): Resource[] {
  if (category === 'github') return resources.filter((r) => !!r.github)
  return resources.filter((r) => r.category === category)
}

export function categoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const c of CATEGORY_SLUGS) counts[c] = byCategory(c).length
  return counts
}

export function subcategoryCounts(category: string): { slug: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const r of byCategory(category)) {
    if (r.category === 'github' || !r.subcategory) continue
    counts.set(r.subcategory, (counts.get(r.subcategory) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}

export function validSubcategories(category: string, min = SUBCAT_PAGE_MIN) {
  return subcategoryCounts(category).filter((s) => s.count >= min)
}

export function tagCounts(min = 1): { slug: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const r of resources) {
    for (const t of r.tags || []) {
      const slug = t.toLowerCase().trim()
      if (slug) counts.set(slug, (counts.get(slug) || 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .filter((t) => t.count >= min)
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}

export function validTags(min = TAG_PAGE_MIN) {
  return tagCounts(min)
}

export function byTag(tag: string): Resource[] {
  const t = tag.toLowerCase()
  return resources.filter((r) => (r.tags || []).some((x) => x.toLowerCase() === t))
}

// 有资格生成 /tags/:tag 聚合页的标签集合（卡片上的标签芯片只链接这些，避免死链）
let _tagSet: Set<string> | null = null
export function tagPageSet(): Set<string> {
  if (!_tagSet) _tagSet = new Set(validTags().map((t) => t.slug))
  return _tagSet
}

export function findResource(category: string, slug: string): Resource | undefined {
  return resources.find((r) => r.category === category && r.slug === slug)
}

export function recentResources(n: number): Resource[] {
  return [...resources]
    .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '') || a.name.localeCompare(b.name))
    .slice(0, n)
}

// 相似资源：同分类优先，按共享标签数 + 同子类目打分，不足时跨分类补齐
export function relatedResources(self: Resource, n = 6): Resource[] {
  const scored = resources
    .filter((r) => r.slug !== self.slug && r.category !== 'github')
    .map((r) => {
      const shared = (r.tags || []).filter((t) => (self.tags || []).includes(t)).length
      let score = shared
      if (r.category === self.category) score += 2
      if (r.subcategory && r.subcategory === self.subcategory) score += 2
      return { r, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.r.name.localeCompare(b.r.name))
  const sameCat = scored.filter((x) => x.r.category === self.category)
  const rest = scored.filter((x) => x.r.category !== self.category)
  return [...sameCat, ...rest].slice(0, n).map((x) => x.r)
}

// 全站热门子类目聚合页（首页 Popular Categories 用）
export function popularSubcategoryPages(n = 6): { category: string; sub: string; count: number }[] {
  const all: { category: string; sub: string; count: number }[] = []
  for (const c of CATEGORY_SLUGS) {
    if (c === 'github') continue
    for (const s of validSubcategories(c)) all.push({ category: c, sub: s.slug, count: s.count })
  }
  const seenBest = new Map<string, { category: string; sub: string; count: number }>()
  for (const item of all) {
    const prev = seenBest.get(item.sub)
    if (!prev || item.count > prev.count) seenBest.set(item.sub, item)
  }
  return [...seenBest.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
}
