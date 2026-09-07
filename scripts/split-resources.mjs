#!/usr/bin/env node
// 合并数据 → 一文件一资源：scripts/merged/*.json（数组）拆到 data/resources/<category>/<slug>.json
// 用法：node scripts/split-resources.mjs
// 日常新增资源仍走「直接加一个 JSON 文件」；本脚本只在批量导入/重建时使用。
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mergedDir = resolve(root, 'scripts/merged')
const outDir = resolve(root, 'data/resources')

const REAL_CATEGORIES = new Set([
  'directories', 'skills', 'awesome', 'agents', 'tools',
  'models', 'platforms', 'datasets', 'learning',
])

// type 推导：category 默认值 + 特例覆盖（skills 里的运行时 / MCP 服务器 / 技能合集）
const TYPE_OVERRIDES = {
  openclaw: 'framework',
  'claude-code': 'framework',
  'codex-cli': 'framework',
  'gemini-cli': 'framework',
  biomcp: 'mcp-server',
  mcpmed: 'mcp-server',
  'gget-mcp': 'mcp-server',
  'mcp-reference-servers': 'mcp-server',
  'biocontextai-registry': 'mcp-server',
  'anthropic-life-sciences': 'mcp-server',
  'awesome-bio-agent-skills': 'skill-collection',
  'awesome-genomic-skills': 'skill-collection',
  'awesome-medical-ai-skills': 'skill-collection',
}
const TYPE_DEFAULT = {
  directories: 'directory',
  skills: 'skill-library',
  awesome: 'awesome-list',
  agents: 'agent',
  tools: 'tool',
  models: 'model',
  platforms: 'platform',
  datasets: 'dataset',
}
const LEARNING_TYPE = {
  courses: 'course', tutorials: 'tutorial', documentation: 'docs',
  books: 'book', lectures: 'lecture', papers: 'paper',
}

// 首页 Featured 精选（人工维护）
const FEATURED = new Set([
  'alphafold-3', 'biomni', 'clawbio', 'awesome-genomic-skills',
  'bioai-agents-directory', 'nvidia-bionemo', 'awesome-bioinformatics',
  'therapeutics-data-commons', 'openclaw', 'rcsb-pdb',
])

// 跨分类重复：仅保留首个出现（后者整条丢弃并告警）
function normalizeTags(tags) {
  return [...new Set(
    (tags || [])
      .map((t) => String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
      .filter(Boolean),
  )]
}

const batches = readdirSync(mergedDir)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(readFileSync(resolve(mergedDir, f), 'utf8')))

const issues = []
const seenSlugs = new Set()
const clean = []
for (const r of batches) {
  if (seenSlugs.has(r.slug)) {
    issues.push(`[dropped-duplicate] ${r.slug}（保留首个分类，丢弃 ${r.category} 版本）`)
    continue
  }
  seenSlugs.add(r.slug)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug || '')) issues.push(`${r.name}: slug 非法 "${r.slug}"`)
  if (!REAL_CATEGORIES.has(r.category)) issues.push(`${r.name}: 非法 category "${r.category}"`)
  if (!/^https?:\/\//.test(r.url || '')) issues.push(`${r.name}: 缺少合法 url`)
  if (!r.description || r.description.length < 20) issues.push(`${r.name}: description 太短`)

  const type =
    TYPE_OVERRIDES[r.slug] ||
    (r.category === 'learning' ? LEARNING_TYPE[r.subcategory] || 'tutorial' : TYPE_DEFAULT[r.category])

  clean.push({
    name: r.name,
    slug: r.slug,
    category: r.category,
    subcategory: r.subcategory || null,
    type,
    description: r.description,
    longDescription: r.longDescription || null,
    url: r.url,
    github: r.github || null,
    tags: normalizeTags(r.tags),
    openSource: !!r.openSource,
    agentSupport: !!r.agentSupport,
    mcp: !!r.mcp,
    openclaw: !!r.openclaw,
    featured: FEATURED.has(r.slug),
    status: r.status || 'active',
    publisher: r.publisher || null,
    language: r.language || null,
    stars: typeof r.stars === 'number' ? r.stars : null,
    license: r.license || null,
    addedAt: r.addedAt || null,
  })
}

// 子类目词表校验（与 data/categories.ts 对齐）
const SUB_VOCAB = {
  skills: ['openclaw', 'claude-code', 'codex', 'gemini-cli', 'mcp', 'general'],
  awesome: ['bioai', 'bioinformatics', 'genomics', 'drug-discovery', 'medical-ai', 'ai4science', 'chemistry', 'single-cell'],
  agents: ['drug-discovery', 'bioinformatics', 'genomics', 'protein-design', 'literature', 'clinical-research', 'scientific', 'lab-automation'],
  tools: ['drug-discovery', 'molecular-design', 'protein-design', 'antibody-design', 'genomics', 'bioinformatics', 'single-cell', 'structural-biology', 'cheminformatics', 'clinical-research', 'literature-research', 'lab-automation'],
  models: ['structure-prediction', 'protein-language', 'molecular', 'genomics', 'single-cell', 'biomedical-lm'],
  platforms: ['drug-discovery', 'lab-informatics', 'research-ai'],
  datasets: ['genomics', 'proteomics', 'protein', 'molecular', 'drug-discovery', 'single-cell', 'clinical', 'biomedical'],
  learning: ['courses', 'tutorials', 'documentation', 'books', 'lectures', 'papers'],
}
for (const r of clean) {
  const vocab = SUB_VOCAB[r.category]
  if (r.subcategory && vocab && !vocab.includes(r.subcategory)) {
    issues.push(`${r.slug}: 子类目 "${r.subcategory}" 不在 ${r.category} 词表内`)
  }
}

for (const i of issues) console.error('  ! ' + i)

// addedAt：批量导入时按名称序错开 14 天窗口，让 Recently Added 有梯度
const today = new Date()
const byName = [...clean].sort((a, b) => a.name.localeCompare(b.name))
byName.forEach((r, i) => {
  if (!r.addedAt) {
    const d = new Date(today.getTime() - (i % 14) * 86400000)
    r.addedAt = d.toISOString().slice(0, 10)
  }
})

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true })
const counts = {}
for (const r of byName) {
  mkdirSync(resolve(outDir, r.category), { recursive: true })
  writeFileSync(resolve(outDir, r.category, `${r.slug}.json`), JSON.stringify(r, null, 2) + '\n')
  counts[r.category] = (counts[r.category] || 0) + 1
}

// 同步产出一份合并 JSON：供 server 路由（sitemap）静态导入——nitro 预渲染路由块
// 不支持 import.meta.glob，页面端继续用 glob 按需内联
mkdirSync(resolve(root, 'data/generated'), { recursive: true })
writeFileSync(resolve(root, 'data/generated/all-resources.json'), JSON.stringify(byName, null, 2) + '\n')

const total = byName.length
console.log(`拆分完成：${total} 个资源（featured ${byName.filter((r) => r.featured).length}）`)
for (const [c, n] of Object.entries(counts).sort()) console.log(`  ${c}: ${n}`)
