// SEO 组合式函数：OG / Twitter / JSON-LD 统一出口。
// canonical 与 hreflang 由 app.vue 的 useLocaleHead 全局生成（en 无前缀 x-default、zh /zh 前缀），
// 这里不再手动设 canonical，避免双写互相覆盖。
import { SITE, TYPE_LABELS, TYPE_LABELS_ZH, type Locale } from '~/data/categories'

export function useSiteUrl(): string {
  const config = useRuntimeConfig()
  return (config.public.siteUrl as string) || SITE.url
}

export function usePageSeo(opts: { title: string; description: string; ogType?: 'website' | 'article' }) {
  useHead({ title: opts.title })
  useSeoMeta({
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogSiteName: SITE.name,
    ogType: opts.ogType || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
  })
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
  const { locale } = useI18n()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: 'BioAI Navigation',
    url: siteUrl,
    description: locale.value === 'zh' ? SITE.zh.description : SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}${locale.value === 'zh' ? '/zh' : ''}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function collectionJsonLd(opts: {
  name: string
  description: string
  path: string // locale 感知的完整路径（zh 带 /zh 前缀）
  resources: { name: string; slug: string; category: string }[]
}) {
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
        url: `${siteUrl}${opts.path.startsWith('/zh') ? '/zh' : ''}/${r.category}/${r.slug}`,
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

export function typeLabel(type: string, locale: Locale = 'en'): string {
  return (locale === 'zh' ? TYPE_LABELS_ZH : TYPE_LABELS)[type] || 'Resource'
}

// 标签 slug → 展示名（小写词表 → Title Case；中文映射优先，缩写词特判）
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

const TAG_ZH: Record<string, string> = {
  'drug-discovery': '药物发现',
  'protein-design': '蛋白质设计',
  bioinformatics: '生物信息学',
  genomics: '基因组学',
  'single-cell': '单细胞',
  'clinical-trials': '临床试验',
  'protein-structure': '蛋白质结构',
  docking: '分子对接',
  'deep-learning': '深度学习',
  'machine-learning': '机器学习',
  'foundation-model': '基础模型',
  llm: '大语言模型',
  mcp: 'MCP',
  skills: '技能',
  agent: '智能体',
  agents: '智能体',
  benchmark: '基准测试',
  database: '数据库',
  databases: '数据库',
  visualization: '可视化',
  cheminformatics: '化学信息学',
  transcriptomics: '转录组学',
  protein: '蛋白质',
  proteins: '蛋白质',
  proteomics: '蛋白质组学',
  molecules: '分子',
  ai: '人工智能',
  'open-source': '开源',
  workflow: '工作流',
  reproducibility: '可复现性',
  'curated-list': '精选清单',
  biomedical: '生物医学',
  'medical-ai': '医疗 AI',
  'antibody-design': '抗体设计',
  'variant-calling': '变异检测',
  'scrna-seq': 'scRNA-seq',
  clinical: '临床',
  cancer: '癌症',
  eqtl: 'eQTL',
  'gene-expression': '基因表达',
  networks: '网络',
  graph: '图网络',
  course: '课程',
  book: '书籍',
  review: '综述',
  paper: '论文',
  tutorial: '教程',
  documentation: '文档',
  training: '培训',
  'agent-framework': '智能体框架',
  openclaw: 'OpenClaw',
  gwas: '全基因组关联分析',
  'diffusion-model': '扩散模型',
  'generative-model': '生成模型',
  'inverse-folding': '逆折叠',
  'virtual-screening': '虚拟筛选',
  'binding-affinity': '结合亲和力',
  'structure-prediction': '结构预测',
  'protein-language-model': '蛋白质语言模型',
  'dna-language-model': 'DNA 语言模型',
  'variant-effect': '变异效应',
  'gene-regulation': '基因调控',
  'multi-agent': '多智能体',
  'knowledge-graph': '知识图谱',
  'autonomous-research': '自主科研',
  'multi-omics': '多组学',
  'precision-medicine': '精准医疗',
  oncology: '肿瘤学',
  'real-world-data': '真实世界数据',
  'lab-informatics': '实验室信息化',
  'wet-lab': '湿实验',
  ai4science: 'AI4Science',
  healthcare: '医疗健康',
  biopharma: '生物制药',
  intelligence: '行业情报',
  newsletter: '邮件通讯',
  news: '资讯',
  registry: '注册表',
  'life-science': '生命科学',
  software: '软件',
  pipelines: '分析管线',
  community: '社区',
  chemistry: '化学',
  'computational-chemistry': '计算化学',
  'molecular-biology': '分子生物学',
  'cloud-platform': '云平台',
  'data-management': '数据管理',
  'cryo-em': '冷冻电镜',
  '3d-structures': '三维结构',
  sequence: '序列',
  annotation: '注释',
  bioactivity: '生物活性',
  compounds: '化合物',
  problems: '题库',
  practice: '实战练习',
  algorithms: '算法',
  'rna-seq': 'RNA-seq',
  'data-analysis': '数据分析',
  'protein-interactions': '蛋白质相互作用',
  'publication-figures': '论文插图',
  scripting: '脚本',
  'molecular-graphics': '分子图形',
  'web-tool': '在线工具',
  'web-platform': '网页平台',
  hpc: '高性能计算',
  cloud: '云计算',
  gpu: 'GPU',
  microservices: '微服务',
  'self-hosted': '自托管',
  'skill-registry': '技能注册表',
  'skill-format': '技能格式',
  reference: '参考实现',
  servers: '服务器',
  protocol: '协议',
  'systems-biology': '系统生物学',
  literature: '文献',
  'clinical-research': '临床研究',
  'report-writing': '报告撰写',
  'question-answering': '问答',
  'tool-use': '工具调用',
  'hypothesis-generation': '假设生成',
  nanobody: '纳米抗体',
  'virtual-lab': '虚拟实验室',
  'protein-folding': '蛋白质折叠',
  alphafold: 'AlphaFold',
  esmfold: 'ESMFold',
  'open-weights': '开放权重',
  'target-discovery': '靶点发现',
  'clinical-stage': '临床阶段',
  therapeutics: '治疗性药物',
  biologics: '生物药',
  simulation: '模拟',
  'molecular-modeling': '分子建模',
  automation: '自动化',
  'generative-ai': '生成式 AI',
  genomicsmodels: '基因组模型',
  'gene-network': '基因网络',
  'virtual-screenings': '虚拟筛选',
  'lead-optimization': '先导化合物优化',
  scaffold: '分子骨架',
  'graph-model': '图模型',
  'graph-neural-network': '图神经网络',
  'sequence-design': '序列设计',
  'binder-design': '结合蛋白设计',
  'de-novo-design': '从头设计',
  'baker-lab': 'Baker 实验室',
  'protein-complexes': '蛋白质复合物',
  'molecule-generation': '分子生成',
  'free-courses': '免费课程',
  'data-portal': '数据门户',
  'data-platform': '数据平台',
  atlas: '细胞图谱',
  'multi-omic': '多组学',
  'functional-genomics': '功能基因组学',
  'chip-seq': 'ChIP-seq',
  biopharmaceuticals: '生物制药',
}

export function tagLabel(slug: string, locale: Locale = 'en'): string {
  const key = slug.toLowerCase()
  if (locale === 'zh' && TAG_ZH[key]) return TAG_ZH[key]
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
