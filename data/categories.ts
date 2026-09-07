// 分类注册表：10 个一级分类的导航文案、SEO 文案与子类目词表。
// 这是全站唯一分类事实来源——nuxt.config 预渲染种子、页头页脚导航、
// 列表页/详情页/子类目聚合页的 SEO 都从这里取。

export interface SubcategoryMeta {
  slug: string
  label: string
}

export interface CategoryMeta {
  slug: string
  title: string // 导航/卡片短标题
  blurb: string // 首页 Explore 卡片一句话
  headline: string // 列表页 H1
  tagline: string // H1 下的副标题
  seoTitle: string
  seoDescription: string
  intro: [string, string] // 列表页正文两段（保证页面不薄）
  virtual?: boolean // github = 跨分类虚拟视图（聚合所有带 GitHub 仓库的资源）
  subcategories?: SubcategoryMeta[]
}

export const SITE = {
  name: 'BioAI Nav',
  url: 'https://bioainav.aiworkagent.org',
  tagline: 'The Navigation Hub for AI in Biology & Biotech',
  description:
    'BioAI Nav is the discovery layer of the BioAI ecosystem. Find AI tools, agents, skills, awesome lists, models, platforms, GitHub projects, datasets and learning resources for biology and biotech — all in one place.',
  githubRepo: 'the-beating-light-of-the-nail/bioai-nav',
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'directories',
    title: 'Directories',
    blurb: 'Where the ecosystem catalogs itself — BioAI tool and agent directories.',
    headline: 'BioAI Directories & Tool Catalogs',
    tagline: 'The navigation layer behind the navigation',
    seoTitle: 'BioAI Directories — Where to Find AI Biology Tools | BioAI Nav',
    seoDescription:
      'Curated list of BioAI tool directories and agent directories. Find where the AI-for-biology ecosystem catalogs its tools, agents, skills and models.',
    intro: [
      'BioAI resources are scattered across dozens of directories, lab pages and product sites. Before you can pick a tool, you first have to find the catalogs worth searching. This page collects the directories that actually map the AI-in-biology ecosystem — general BioAI tool directories, agent directories and curated catalogs maintained by the community.',
      'Use these directories as your starting points for broad discovery, then come back to BioAI Nav to jump straight to the right subdomain: agents, skills, awesome lists, models, datasets or learning resources.',
    ],
  },
  {
    slug: 'skills',
    title: 'Agent Skills',
    blurb: 'Skill libraries and MCP servers that give coding agents real bio capabilities.',
    headline: 'Agent Skills & MCP Servers for Biology',
    tagline: 'OpenClaw · Claude Code · Codex · Gemini CLI · MCP',
    seoTitle: 'Bio Agent Skills — OpenClaw, Claude Code, MCP for Biology | BioAI Nav',
    seoDescription:
      'Agent skill libraries, skill packs and MCP servers for biology, bioinformatics and medicine. Power OpenClaw, Claude Code, Codex and Gemini CLI agents with real bio capabilities.',
    intro: [
      'Coding agents are becoming the fastest way to automate bioinformatics work — if they have the right skills. Skill libraries and MCP servers teach OpenClaw, Claude Code, Codex, Gemini CLI and Cursor agents how to run pipelines, query sequence databases, parse structures and reason about experiments.',
      'This section catalogs bio agent skills: framework-specific skill packs, MCP servers for biology data sources, and general scientific skill collections. Every entry notes which agent framework it targets.',
    ],
    subcategories: [
      { slug: 'openclaw', label: 'OpenClaw' },
      { slug: 'claude-code', label: 'Claude Code' },
      { slug: 'codex', label: 'Codex' },
      { slug: 'gemini-cli', label: 'Gemini CLI' },
      { slug: 'mcp', label: 'MCP Servers' },
      { slug: 'general', label: 'General' },
    ],
  },
  {
    slug: 'awesome',
    title: 'Awesome Lists',
    blurb: 'The GitHub awesome lists that map the AI-biology landscape.',
    headline: 'Awesome BioAI Lists',
    tagline: 'Curated GitHub lists worth starring',
    seoTitle: 'Awesome BioAI Lists — Best GitHub Curated Lists | BioAI Nav',
    seoDescription:
      'The best awesome lists for BioAI: awesome bioinformatics, awesome drug discovery, awesome genomics, awesome AI4Science and more — the curated GitHub lists that map the AI-biology ecosystem.',
    intro: [
      'Awesome lists are the field notes of the BioAI community: hand-curated, continuously updated, and ruthlessly specific. A good awesome list saves you days of searching — it is often the single best map of a subdomain like bioinformatics, drug discovery or AI4Science.',
      'We track the awesome lists that stay current. Each entry links the canonical repository so you can star it and watch for updates, and we note the subdomain it covers.',
    ],
    subcategories: [
      { slug: 'bioai', label: 'BioAI' },
      { slug: 'bioinformatics', label: 'Bioinformatics' },
      { slug: 'genomics', label: 'Genomics' },
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'medical-ai', label: 'Medical AI' },
      { slug: 'ai4science', label: 'AI4Science' },
      { slug: 'chemistry', label: 'Chemistry' },
      { slug: 'single-cell', label: 'Single Cell' },
    ],
  },
  {
    slug: 'agents',
    title: 'AI Agents',
    blurb: 'Autonomous agents that do bioinformatics, genomics and drug discovery work.',
    headline: 'AI Agents for Biology',
    tagline: 'Autonomous science: from literature review to wet-lab design',
    seoTitle: 'AI Agents for Biology & Drug Discovery | BioAI Nav',
    seoDescription:
      'Open-source AI agents for bioinformatics, genomics, drug discovery, protein design and literature review. Autonomous scientific agents doing real biology work.',
    intro: [
      'The newest layer of the BioAI stack is agentic: LLM-driven agents that plan experiments, orchestrate tools, read the literature and even co-design biomolecules. These projects move fast and the signal-to-noise ratio is low — so we track the ones with real code, real results and active maintenance.',
      'Browse by domain: drug discovery, bioinformatics, genomics, protein design, literature, clinical research and lab automation.',
    ],
    subcategories: [
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'bioinformatics', label: 'Bioinformatics' },
      { slug: 'genomics', label: 'Genomics' },
      { slug: 'protein-design', label: 'Protein Design' },
      { slug: 'literature', label: 'Literature' },
      { slug: 'clinical-research', label: 'Clinical Research' },
      { slug: 'scientific', label: 'Scientific (General)' },
      { slug: 'lab-automation', label: 'Lab Automation' },
    ],
  },
  {
    slug: 'tools',
    title: 'AI Tools',
    blurb: 'Concrete software for protein design, genomics, cheminformatics and more.',
    headline: 'AI Tools for Biology & Biotech',
    tagline: 'The software layer of the BioAI stack',
    seoTitle: 'AI Tools for Biology & Biotech — Verified Directory | BioAI Nav',
    seoDescription:
      'A curated directory of AI tools for biology: protein design, drug discovery, genomics, bioinformatics, single-cell, cheminformatics and structural biology.',
    intro: [
      'This is the working toolkit: molecular docking, protein structure prediction, single-cell analysis, variant calling, cheminformatics libraries. Every entry is a tool you can actually run today — web server, Python library or command line — with its official site and, where available, open-source repository.',
      'Filter by domain, license and agent-readiness. If a tool exposes an API or an MCP server, we flag it: agent-ready tools are the ones your AI agents can drive directly.',
    ],
    subcategories: [
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'molecular-design', label: 'Molecular Design' },
      { slug: 'protein-design', label: 'Protein Design' },
      { slug: 'antibody-design', label: 'Antibody Design' },
      { slug: 'genomics', label: 'Genomics' },
      { slug: 'bioinformatics', label: 'Bioinformatics' },
      { slug: 'single-cell', label: 'Single Cell' },
      { slug: 'structural-biology', label: 'Structural Biology' },
      { slug: 'cheminformatics', label: 'Cheminformatics' },
      { slug: 'clinical-research', label: 'Clinical Research' },
      { slug: 'literature-research', label: 'Literature Research' },
      { slug: 'lab-automation', label: 'Lab Automation' },
    ],
  },
  {
    slug: 'models',
    title: 'Models',
    blurb: 'Biology foundation models: AlphaFold, ESM, Evo and the next wave.',
    headline: 'BioAI Foundation Models',
    tagline: 'Protein language models · genomic AI · molecular models',
    seoTitle: 'BioAI Foundation Models — Protein, Genomics, Molecular | BioAI Nav',
    seoDescription:
      'Biology foundation models: AlphaFold, ESM, Evo, Geneformer, scGPT and more. Structure prediction, protein language models, genomic and molecular AI.',
    intro: [
      'Foundation models are the engines of modern BioAI. Protein language models read and generate sequences, structure predictors fold them, genomic models reason across regulatory DNA, and single-cell models embed the transcriptome. Most are downloadable or served through a public API.',
      'Each entry lists the paper-backed model family, where to get the weights or predictions, and the repository when the code is open. Filter by modality: structure prediction, protein language, molecular, genomics, single-cell and biomedical language models.',
    ],
    subcategories: [
      { slug: 'structure-prediction', label: 'Structure Prediction' },
      { slug: 'protein-language', label: 'Protein Language Models' },
      { slug: 'molecular', label: 'Molecular Models' },
      { slug: 'genomics', label: 'Genomics Models' },
      { slug: 'single-cell', label: 'Single-Cell Models' },
      { slug: 'biomedical-lm', label: 'Biomedical Language Models' },
    ],
  },
  {
    slug: 'platforms',
    title: 'Platforms',
    blurb: 'Commercial BioAI platforms: BioNeMo, Insilico, Recursion, Benchling.',
    headline: 'BioAI Platforms & Infrastructure',
    tagline: 'Industrial-grade AI for drug discovery and the lab',
    seoTitle: 'BioAI Platforms — Drug Discovery & Lab Infrastructure | BioAI Nav',
    seoDescription:
      'Commercial BioAI platforms and infrastructure: NVIDIA BioNeMo, Insilico Medicine, Recursion, Isomorphic Labs, Benchling and other AI-driven biotech platforms.',
    intro: [
      'Platforms are where BioAI meets production: cloud services that train and serve foundation models, end-to-end drug discovery engines, and the informatics backbone of modern labs. They range from open cloud services you can call today to partnership-driven pharma AI engines.',
      'We profile each platform by what it actually ships — services, models, integrations — and note what is publicly accessible versus enterprise-only.',
    ],
    subcategories: [
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'lab-informatics', label: 'Lab Informatics' },
      { slug: 'research-ai', label: 'Research AI' },
    ],
  },
  {
    slug: 'github',
    title: 'GitHub',
    blurb: 'Every cataloged project with an open repository — stars, language, license.',
    headline: 'BioAI on GitHub',
    tagline: 'The open-source layer, across every category',
    seoTitle: 'BioAI GitHub — Open-Source Biology AI Repositories | BioAI Nav',
    seoDescription:
      'Open-source BioAI repositories on GitHub: protein design, bioinformatics pipelines, foundation models and agent frameworks — with stars, language and license.',
    intro: [
      'GitHub is where BioAI actually lives: the model code, the pipelines, the awesome lists and the agent frameworks. This view aggregates every BioAI Nav entry that ships an open repository, across all categories — models, tools, datasets, skills and agents.',
      'Stars and last-update data are indicative, not gospel; we refresh them periodically. Open a resource\u2019s page for the full picture: license, language, docs and related projects.',
    ],
    virtual: true,
  },
  {
    slug: 'datasets',
    title: 'Datasets',
    blurb: 'PDB, UniProt, ChEMBL, TDC — the data every BioAI model is trained on.',
    headline: 'BioAI Datasets & Data Resources',
    tagline: 'The data layer: sequences, structures, molecules, cells, patients',
    seoTitle: 'BioAI Datasets — Protein, Molecular, Genomics, Clinical | BioAI Nav',
    seoDescription:
      'Key datasets for AI in biology: PDB, UniProt, ChEMBL, TDC, TCGA, GTEx and more. Molecular, protein, genomics, single-cell and clinical data for training and benchmarking.',
    intro: [
      'No data, no BioAI. Structure prediction leans on PDB and AlphaFold DB, molecular AI on ChEMBL and ZINC, genomics on Ensembl and TCGA, single-cell on atlases that keep growing. Knowing which dataset is canonical for a task — and how to get it — is half of the work.',
      'We list the data resources worth knowing, what they contain, how they are licensed and where the bulk-access points are. Filter by modality: protein, molecular, genomics, proteomics, single-cell, clinical and biomedical.',
    ],
    subcategories: [
      { slug: 'protein', label: 'Protein' },
      { slug: 'molecular', label: 'Molecular' },
      { slug: 'genomics', label: 'Genomics' },
      { slug: 'proteomics', label: 'Proteomics' },
      { slug: 'single-cell', label: 'Single Cell' },
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'clinical', label: 'Clinical' },
      { slug: 'biomedical', label: 'Biomedical' },
    ],
  },
  {
    slug: 'learning',
    title: 'Learning',
    blurb: 'Courses, books, tutorials and landmark reviews for AI × biology.',
    headline: 'Learn AI for Biology',
    tagline: 'Courses · books · tutorials · documentation · landmark reviews',
    seoTitle: 'Learn AI for Biology — Courses, Books & Tutorials | BioAI Nav',
    seoDescription:
      'Learning resources for AI in biology: courses, books, tutorials, documentation and landmark reviews — from protein design to computational genomics.',
    intro: [
      'BioAI sits at the junction of two steep learning curves. The good news: the best material is free — university courses, hands-on problem sets, open books and the documentation of the major tool ecosystems. The bad news: it is scattered across a dozen sites.',
      'This section curates the resources that actually teach: structured courses, practical tutorials, reference documentation, open books and the review papers that anchor a subfield. Filter by format below.',
    ],
    subcategories: [
      { slug: 'courses', label: 'Courses' },
      { slug: 'tutorials', label: 'Tutorials' },
      { slug: 'documentation', label: 'Documentation' },
      { slug: 'books', label: 'Books' },
      { slug: 'lectures', label: 'Lectures' },
      { slug: 'papers', label: 'Papers & Reviews' },
    ],
  },
]

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)

export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

// 子类目聚合页 SEO 标题/描述模板（程序化 SEO 的文案层）
const SUB_SEO: Record<string, (label: string, count: number) => { title: string; description: string; headline: string }> = {
  tools: (l, n) => ({
    title: `AI Tools for ${l} — ${n}+ Curated Tools | BioAI Nav`,
    description: `A hand-curated list of ${n}+ AI tools for ${l.toLowerCase()} in biology and biotech, with open-source status, GitHub repos and agent-readiness.`,
    headline: `AI Tools for ${l}`,
  }),
  agents: (l, n) => ({
    title: `AI Agents for ${l} — Open-Source Projects | BioAI Nav`,
    description: `${n}+ AI agents and agentic systems for ${l.toLowerCase()}: open-source projects, frameworks and research systems doing real biology work.`,
    headline: `AI Agents for ${l}`,
  }),
  models: (l, n) => ({
    title: `${l} — BioAI Foundation Models | BioAI Nav`,
    description: `${n}+ ${l.toLowerCase()} for biology and biotech: weights, papers, APIs and repositories, curated and verified by BioAI Nav.`,
    headline: l,
  }),
  platforms: (l, n) => ({
    title: `${l} — BioAI Platform Directory | BioAI Nav`,
    description: `${n}+ ${l.toLowerCase()} in the BioAI ecosystem: what each platform ships, what is public and what is enterprise-only.`,
    headline: l,
  }),
  datasets: (l, n) => ({
    title: `${l} Datasets for BioAI — Curated Data Resources | BioAI Nav`,
    description: `Key ${l.toLowerCase()} datasets for AI in biology: contents, licensing and access points, curated by BioAI Nav.`,
    headline: `${l} Datasets & Data Resources`,
  }),
  skills: (l, n) => ({
    title: `${l} Bio Agent Skills — Libraries & MCP Servers | BioAI Nav`,
    description: `Bio agent skills and MCP servers for ${l}: give your coding agents real biology, bioinformatics and medicine capabilities.`,
    headline: `Bio Agent Skills for ${l}`,
  }),
  awesome: (l, n) => ({
    title: `Awesome ${l} — Curated GitHub Lists | BioAI Nav`,
    description: `The awesome lists that map ${l.toLowerCase()} on GitHub — curated, community-maintained and worth starring.`,
    headline: `Awesome ${l}`,
  }),
  learning: (l, n) => ({
    title: `AI for Biology ${l} — Learn BioAI | BioAI Nav`,
    description: `Curated ${l.toLowerCase()} for learning AI in biology and biotech — from first principles to frontier methods.`,
    headline: `AI for Biology — ${l}`,
  }),
}

export function subcategorySeo(categorySlug: string, label: string, count: number) {
  const fn = SUB_SEO[categorySlug]
  if (fn) return fn(label, count)
  return {
    title: `${label} | BioAI Nav`,
    description: `Curated ${label} resources in the BioAI ecosystem.`,
    headline: label,
  }
}

// 资源 type → 展示标签
export const TYPE_LABELS: Record<string, string> = {
  directory: 'Directory',
  'skill-library': 'Skill Library',
  'awesome-list': 'Awesome List',
  'mcp-server': 'MCP Server',
  agent: 'AI Agent',
  tool: 'Tool',
  model: 'Model',
  platform: 'Platform',
  dataset: 'Dataset',
  course: 'Course',
  book: 'Book',
  tutorial: 'Tutorial',
  docs: 'Documentation',
  paper: 'Paper / Review',
  lecture: 'Lectures',
  github: 'Repo',
}
