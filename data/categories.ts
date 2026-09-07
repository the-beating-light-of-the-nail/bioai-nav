// 分类注册表：10 个一级分类的导航文案、SEO 文案与子类目词表（中英双语）。
// 这是全站唯一分类事实来源——nuxt.config 预渲染种子、页头页脚导航、
// 列表页/详情页/子类目聚合页的 SEO 都从这里取。
// 英文字段为主字段，中文放在 zh 子对象；helper 按 locale 取值。

export type Locale = 'en' | 'zh'

export interface SubcategoryMeta {
  slug: string
  label: string
}

export interface CategoryZh {
  title: string
  blurb: string
  headline: string
  tagline: string
  seoTitle: string
  seoDescription: string
  intro: [string, string]
  subcategoryLabels?: Record<string, string>
}

export interface CategoryMeta {
  slug: string
  title: string
  blurb: string
  headline: string
  tagline: string
  seoTitle: string
  seoDescription: string
  intro: [string, string]
  virtual?: boolean // github = 跨分类虚拟视图（聚合所有带 GitHub 仓库的资源）
  subcategories?: SubcategoryMeta[]
  zh: CategoryZh
}

export const SITE = {
  name: 'BioAI Nav',
  url: 'https://bioainav.aiworkagent.org',
  tagline: 'The Navigation Hub for AI in Biology & Biotech',
  description:
    'BioAI Nav is the BioAI tools directory: a curated map of AI tools for biology and biotech, AI agents for bioinformatics and drug discovery, agent skills, awesome lists, foundation models, datasets and learning resources — all in one place.',
  zh: {
    tagline: 'AI 生物学与生物科技领域的导航中心',
    description:
      'BioAI Nav 是 BioAI 工具目录与发现层：一站式找到生物学与生物科技 AI 工具、生物信息学与药物发现 AI 智能体、智能体技能、Awesome 清单、基础模型、数据集与学习资源。',
  },
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
    zh: {
      title: '目录站',
      blurb: '生态自己整理自己的地方——BioAI 工具与智能体目录站。',
      headline: 'BioAI 目录与工具总目',
      tagline: '导航背后的导航',
      seoTitle: 'BioAI 目录站导航——去哪里找 AI 生物学工具 | BioAI Nav',
      seoDescription:
        '精选的 BioAI 工具目录与智能体目录。想知道 AI 生物学生态的工具、智能体、技能和模型都收录在哪里？从这里开始。',
      intro: [
        'BioAI 资源散落在几十个目录站、实验室页面和产品官网里。在选工具之前，你得先知道哪些目录值得搜。本页收录真正在系统性整理「AI × 生物学」版图的目录——通用 BioAI 工具目录、智能体目录，以及社区维护的精选总目。',
        '把这些目录当作大范围摸底的起点，再回到 BioAI Nav 直达具体领域：智能体、技能、Awesome 清单、模型、数据集或学习资源。',
      ],
    },
  },
  {
    slug: 'skills',
    title: 'Agent Skills',
    blurb: 'Skill libraries and MCP servers that give coding agents real bio capabilities.',
    headline: 'Agent Skills & MCP Servers for Biology',
    tagline: 'OpenClaw · Claude Code · Codex · Gemini CLI · MCP',
    seoTitle: 'AI Agent Skills for Biology & Bioinformatics | BioAI Nav',
    seoDescription:
      'Bioinformatics AI agent skills, skill libraries and MCP servers for OpenClaw, Claude Code, Codex and Gemini CLI — give coding agents real biology and drug discovery capabilities.',
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
    zh: {
      title: '智能体技能',
      blurb: '给编码智能体装上真正生物能力的技能库与 MCP 服务器。',
      headline: '生物学智能体技能与 MCP 服务器',
      tagline: 'OpenClaw · Claude Code · Codex · Gemini CLI · MCP',
      seoTitle: '生物学与生物信息学 AI 智能体技能——技能库与 MCP | BioAI Nav',
      seoDescription:
        '生物信息学 AI 智能体技能、技能库与 MCP 服务器：为 OpenClaw、Claude Code、Codex、Gemini CLI 装上真正的生物学与药物发现能力。',
      intro: [
        '编码智能体正在成为生物信息学工作流最快的自动化方式——前提是它有对的技能。技能库与 MCP 服务器能教会 OpenClaw、Claude Code、Codex、Gemini CLI 和 Cursor 这些智能体跑管线、查序列数据库、解析结构、推理实验。',
        '本板块收录生物智能体技能：按框架划分的技能包、面向生物学数据源的 MCP 服务器，以及通用科研技能合集。每个条目都标注了适配的智能体框架。',
      ],
      subcategoryLabels: {
        openclaw: 'OpenClaw',
        'claude-code': 'Claude Code',
        codex: 'Codex',
        'gemini-cli': 'Gemini CLI',
        mcp: 'MCP 服务器',
        general: '通用',
      },
    },
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
    zh: {
      title: 'Awesome 清单',
      blurb: '值得星标的 GitHub 生态地图。',
      headline: 'Awesome BioAI 清单',
      tagline: '值得星标的社区精选',
      seoTitle: 'Awesome BioAI——最值得收藏的 GitHub 精选清单 | BioAI Nav',
      seoDescription:
        '最有用的 BioAI awesome 清单：awesome bioinformatics、awesome 药物发现、awesome 基因组学、awesome AI4Science——社区整理的 AI 生物学版图。',
      intro: [
        'Awesome 清单是 BioAI 社区的野外笔记：人工精选、持续更新、足够垂直。一份好的 awesome 清单能帮你省掉好几天的搜索——它往往是某个子领域（生物信息学、药物发现、AI4Science）最好的一张地图。',
        '我们只收录还在活跃维护的清单。每个条目都指向官方仓库，方便星标和追更，并标注它覆盖的子领域。',
      ],
      subcategoryLabels: {
        bioai: 'BioAI',
        bioinformatics: '生物信息学',
        genomics: '基因组学',
        'drug-discovery': '药物发现',
        'medical-ai': '医疗 AI',
        ai4science: 'AI4Science',
        chemistry: '化学与化学信息学',
        'single-cell': '单细胞',
      },
    },
  },
  {
    slug: 'agents',
    title: 'AI Agents',
    blurb: 'Autonomous agents that do bioinformatics, genomics and drug discovery work.',
    headline: 'AI Agents for Biology',
    tagline: 'Autonomous science: from literature review to wet-lab design',
    seoTitle: 'AI Agents for Biology & Drug Discovery | BioAI Nav',
    seoDescription:
      'Open-source AI agents for bioinformatics, genomics, drug discovery, protein design and literature review — autonomous biological AI agents doing real science.',
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
      { slug: 'scientific', label: 'Scientific Research' },
      { slug: 'lab-automation', label: 'Lab Automation' },
    ],
    zh: {
      title: 'AI 智能体',
      blurb: '会做生物信息学、基因组学和药物发现工作的自主智能体。',
      headline: '生物学 AI 智能体',
      tagline: '自主科研：从文献调研到湿实验设计',
      seoTitle: '生物学与药物发现 AI 智能体 | BioAI Nav',
      seoDescription:
        '面向生物信息学、基因组学、药物发现、蛋白质设计与文献调研的开源 AI 智能体——真正在做科研的生物智能体。',
      intro: [
        'BioAI 技术栈的最新一层是智能体（agentic）：由大模型驱动的智能体能规划实验、编排工具、读文献，甚至协同设计生物分子。这个方向迭代极快、信噪比极低——所以我们只跟踪有真实代码、真实结果、持续维护的项目。',
        '按领域浏览：药物发现、生物信息学、基因组学、蛋白质设计、文献、临床研究与实验室自动化。',
      ],
      subcategoryLabels: {
        'drug-discovery': '药物发现',
        bioinformatics: '生物信息学',
        genomics: '基因组学',
        'protein-design': '蛋白质设计',
        literature: '文献',
        'clinical-research': '临床研究',
        scientific: '科研',
        'lab-automation': '实验室自动化',
      },
    },
  },
  {
    slug: 'tools',
    title: 'AI Tools',
    blurb: 'Concrete software for protein design, genomics, cheminformatics and more.',
    headline: 'AI Tools for Biology & Biotech',
    tagline: 'The software layer of the BioAI stack',
    seoTitle: 'AI Tools for Biology & Biotech — Verified Directory | BioAI Nav',
    seoDescription:
      'A curated directory of the best AI tools for biology and biotech: AI drug discovery tools, protein design, genomics, bioinformatics, single-cell, cheminformatics and structural biology.',
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
    zh: {
      title: 'AI 工具',
      blurb: '蛋白质设计、基因组学、化学信息学等领域的具体软件。',
      headline: '生物学与生物科技 AI 工具',
      tagline: 'BioAI 技术栈的软件层',
      seoTitle: 'AI 生物学工具导航——最佳生物科技工具精选 | BioAI Nav',
      seoDescription:
        '人工核实的最佳 AI 生物学工具目录：AI 药物发现工具、蛋白质设计、基因组学、生物信息学、单细胞、化学信息学与结构生物学。',
      intro: [
        '这是真正干活的工具箱：分子对接、蛋白质结构预测、单细胞分析、变异检测、化学信息学库。每个条目都是今天就能上手的软件——网页服务、Python 库或命令行——附官方站点与开源仓库（如有）。',
        '按领域、许可证和智能体友好度筛选。如果某个工具开放 API 或提供 MCP 服务器，我们会标注出来——智能体友好的工具，你的 AI 智能体可以直接调用。',
      ],
      subcategoryLabels: {
        'drug-discovery': '药物发现',
        'molecular-design': '分子设计',
        'protein-design': '蛋白质设计',
        'antibody-design': '抗体设计',
        genomics: '基因组学',
        bioinformatics: '生物信息学',
        'single-cell': '单细胞',
        'structural-biology': '结构生物学',
        cheminformatics: '化学信息学',
        'clinical-research': '临床研究',
        'literature-research': '文献调研',
        'lab-automation': '实验室自动化',
      },
    },
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
      { slug: 'molecular', label: 'Molecular' },
      { slug: 'genomics', label: 'Genomics' },
      { slug: 'single-cell', label: 'Single-Cell' },
      { slug: 'biomedical-lm', label: 'Biomedical Language Models' },
    ],
    zh: {
      title: '模型',
      blurb: '生物学基础模型：AlphaFold、ESM、Evo 与下一波。',
      headline: 'BioAI 基础模型',
      tagline: '蛋白质语言模型 · 基因组 AI · 分子模型',
      seoTitle: 'BioAI 基础模型——蛋白质/基因组/分子 | BioAI Nav',
      seoDescription:
        '生物学基础模型：AlphaFold、ESM、Evo、Geneformer、scGPT 等。结构预测、蛋白质语言模型、基因组与分子 AI。',
      intro: [
        '基础模型是现代 BioAI 的发动机。蛋白质语言模型读序列、生成序列，结构预测模型把它们折叠成型，基因组模型横跨调控 DNA 推理，单细胞模型给转录组做嵌入。大多数模型可以下载权重或走公开 API。',
        '每个条目都列出了模型家族的论文出处、权重与预测结果的获取方式，以及代码开源时的仓库。按模态筛选：结构预测、蛋白质语言、分子、基因组、单细胞与生物医学语言模型。',
      ],
      subcategoryLabels: {
        'structure-prediction': '结构预测',
        'protein-language': '蛋白质语言模型',
        molecular: '分子',
        genomics: '基因组',
        'single-cell': '单细胞',
        'biomedical-lm': '生物医学语言模型',
      },
    },
  },
  {
    slug: 'platforms',
    title: 'Platforms',
    blurb: 'Commercial BioAI platforms: BioNeMo, Insilico, Recursion, Benchling.',
    headline: 'BioAI Platforms & Infrastructure',
    tagline: 'Industrial-grade AI for drug discovery and the lab',
    seoTitle: 'AI Drug Discovery Platforms & BioAI Infrastructure | BioAI Nav',
    seoDescription:
      'Commercial AI drug discovery platforms and BioAI infrastructure: NVIDIA BioNeMo, Insilico Medicine, Recursion, Isomorphic Labs, Benchling and other AI-driven biotech platforms.',
    intro: [
      'Platforms are where BioAI meets production: cloud services that train and serve foundation models, end-to-end drug discovery engines, and the informatics backbone of modern labs. They range from open cloud services you can call today to partnership-driven pharma AI engines.',
      'We profile each platform by what it actually ships — services, models, integrations — and note what is publicly accessible versus enterprise-only.',
    ],
    subcategories: [
      { slug: 'drug-discovery', label: 'Drug Discovery' },
      { slug: 'lab-informatics', label: 'Lab Informatics' },
      { slug: 'research-ai', label: 'Research AI' },
    ],
    zh: {
      title: '平台',
      blurb: '商业 BioAI 平台：BioNeMo、英矽智能、Recursion、Benchling。',
      headline: 'BioAI 平台与基础设施',
      tagline: '工业级的药物发现与实验室 AI',
      seoTitle: 'AI 药物发现平台与 BioAI 基础设施 | BioAI Nav',
      seoDescription:
        '商业 AI 药物发现平台与 BioAI 基础设施：NVIDIA BioNeMo、英矽智能、Recursion、Isomorphic Labs、Benchling 等 AI 驱动的生物科技平台。',
      intro: [
        '平台层是 BioAI 走向生产的地方：训练和服务基础模型的云服务、端到端药物发现引擎、现代实验室的信息化骨干。它们有的开放云服务今天就能调用，有的走企业合作模式。',
        '我们按「实际交付什么」给每个平台建档案——服务、模型、集成方式——并注明哪些公开可用、哪些仅企业可用。',
      ],
      subcategoryLabels: {
        'drug-discovery': '药物发现',
        'lab-informatics': '实验室信息化',
        'research-ai': '科研 AI',
      },
    },
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
    zh: {
      title: 'GitHub',
      blurb: '全部收录项目的开源仓库——星标、语言、许可证。',
      headline: 'GitHub 上的 BioAI',
      tagline: '跨分类的开源层',
      seoTitle: 'BioAI GitHub——生物学 AI 开源仓库 | BioAI Nav',
      seoDescription:
        'GitHub 上的 BioAI 开源仓库：蛋白质设计、生物信息学管线、基础模型与智能体框架——附星标、语言与许可证信息。',
      intro: [
        'GitHub 才是 BioAI 真正的家：模型代码、管线、awesome 清单和智能体框架都在这里。这个视图聚合了 BioAI Nav 所有带开源仓库的条目——横跨模型、工具、数据集、技能与智能体全部分类。',
        '星标与更新时间仅供参考，我们会定期刷新。想看完整信息（许可证、语言、文档和相关项目），请点进资源详情页。',
      ],
    },
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
    zh: {
      title: '数据集',
      blurb: 'PDB、UniProt、ChEMBL、TDC——每个 BioAI 模型的训练底料。',
      headline: 'BioAI 数据集与数据资源',
      tagline: '数据层：序列、结构、分子、细胞、患者',
      seoTitle: 'BioAI 数据集——蛋白质/分子/基因组/临床 | BioAI Nav',
      seoDescription:
        'AI 生物学关键数据集：PDB、UniProt、ChEMBL、TDC、TCGA、GTEx 等。分子、蛋白质、基因组、单细胞与临床数据的训练与基准数据源。',
      intro: [
        '没有数据就没有 BioAI。结构预测靠 PDB 和 AlphaFold DB，分子 AI 靠 ChEMBL 和 ZINC，基因组学靠 Ensembl 和 TCGA，单细胞靠不断生长的细胞图谱。知道哪个数据集是某个任务的「正典」、以及怎么拿到它，本身就完成了一半的工作。',
        '我们收录值得认识的数据资源：里面有什么、授权如何、批量获取入口在哪。按模态筛选：蛋白质、分子、基因组、蛋白质组学、单细胞、临床与生物医学。',
      ],
      subcategoryLabels: {
        protein: '蛋白质',
        molecular: '分子',
        genomics: '基因组学',
        proteomics: '蛋白质组学',
        'single-cell': '单细胞',
        'drug-discovery': '药物发现',
        clinical: '临床',
        biomedical: '生物医学',
      },
    },
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
    zh: {
      title: '学习资源',
      blurb: 'AI × 生物的课程、书、教程与经典综述。',
      headline: '学 AI for Biology',
      tagline: '课程 · 书籍 · 教程 · 文档 · 经典综述',
      seoTitle: '学 AI 生物学——课程/书籍/教程导航 | BioAI Nav',
      seoDescription:
        'AI 生物学学习资源：课程、书籍、教程、文档与经典综述——从蛋白质设计到计算基因组学。',
      intro: [
        'BioAI 站在两条陡峭学习曲线的交汇处。好消息是：最好的材料几乎都免费——大学课程、实战题库、开放书籍和主流工具生态的官方文档。坏消息是：它们散落在十几个网站上。',
        '本板块只收录真正能学到东西的资源：体系化课程、实战教程、参考文档、开放书籍，以及锚定一个子领域的综述论文。按形式筛选。',
      ],
      subcategoryLabels: {
        courses: '课程',
        tutorials: '实战教程',
        documentation: '文档',
        books: '书籍',
        lectures: '讲座',
        papers: '论文与综述',
      },
    },
  },
]

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)

export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

// locale 取值 helper：中文字段缺省时回落英文
export function catText(meta: CategoryMeta, locale: Locale) {
  if (locale !== 'zh') return meta
  const zh = meta.zh
  return {
    title: zh.title || meta.title,
    blurb: zh.blurb || meta.blurb,
    headline: zh.headline || meta.headline,
    tagline: zh.tagline || meta.tagline,
    seoTitle: zh.seoTitle || meta.seoTitle,
    seoDescription: zh.seoDescription || meta.seoDescription,
    intro: zh.intro || meta.intro,
  }
}

export function subcategoryLabel(meta: CategoryMeta, subSlug: string, locale: Locale): string {
  if (locale === 'zh') {
    const zhLabel = meta.zh?.subcategoryLabels?.[subSlug]
    if (zhLabel) return zhLabel
  }
  return meta.subcategories?.find((s) => s.slug === subSlug)?.label || subSlug
}

// 子类目聚合页 SEO 标题/描述模板（程序化 SEO 的文案层，中英两套）。
// 模板签名 (label, count, subSlug)：label 是本地化展示名，subSlug 用于按具体子类目定制（如 skills/mcp）。
type SubSeoFn = (label: string, count: number, subSlug: string) => { title: string; description: string; headline: string }

const SUB_SEO_EN: Record<string, SubSeoFn> = {
  tools: (l, n) => ({
    title: `Best AI Tools for ${l} — Curated List | BioAI Nav`,
    description: `${n} hand-curated AI tools for ${l.toLowerCase()} in biology and biotech — open-source status, GitHub repositories and agent-readiness, verified by BioAI Nav.`,
    headline: `AI Tools for ${l}`,
  }),
  agents: (l, n) => ({
    title: `AI Agents for ${l} — Open-Source Projects | BioAI Nav`,
    description: `${n}+ AI agents and agentic systems for ${l.toLowerCase()}: open-source projects, frameworks and research systems doing real biology work.`,
    headline: `AI Agents for ${l}`,
  }),
  models: (l, n) => ({
    title: `${l} AI Models — BioAI Foundation Models | BioAI Nav`,
    description: `${n} ${l.toLowerCase()} AI models for biology and biotech: weights, papers, APIs and repositories, curated and verified by BioAI Nav.`,
    headline: `${l} AI Models`,
  }),
  platforms: (l, n) => ({
    title: `AI ${l} Platforms — BioAI Directory | BioAI Nav`,
    description: `${n} AI ${l.toLowerCase()} platforms and infrastructure in the BioAI ecosystem: what each ships, what is public and what is enterprise-only.`,
    headline: `AI ${l} Platforms`,
  }),
  datasets: (l, n) => ({
    title: `${l} Datasets for BioAI — Curated Data Resources | BioAI Nav`,
    description: `Key ${l.toLowerCase()} datasets for AI in biology: contents, licensing and access points, curated by BioAI Nav.`,
    headline: `${l} Datasets & Data Resources`,
  }),
  skills: (l, n, sub) =>
    sub === 'mcp'
      ? {
          title: 'Biology MCP Servers — AI Agent Skills & Tools | BioAI Nav',
          description: `${n} MCP servers that give AI agents hands-on access to sequences, structures and bioinformatics tools — compatible with Claude Code, OpenClaw, Codex and Gemini CLI.`,
          headline: 'Biology MCP Servers',
        }
      : sub === 'general'
        ? {
            title: 'Bio Agent Skills — Libraries & Skill Packs | BioAI Nav',
            description: `${n} bio agent skill libraries and packs that give coding agents real biology and bioinformatics capabilities — across OpenClaw, Claude Code, Codex and more.`,
            headline: 'Bio Agent Skills',
          }
        : {
            title: `${l} Bio Skills — AI Agent Skills for Biology | BioAI Nav`,
            description: `Bio agent skills and MCP servers for ${l}: give your coding agents real biology, bioinformatics and medicine capabilities.`,
            headline: `Bio Agent Skills for ${l}`,
          },
  awesome: (l) => ({
    title: `Awesome ${l} — Curated GitHub Lists | BioAI Nav`,
    description: `The awesome lists that map ${l.toLowerCase()} on GitHub — curated, community-maintained and worth starring.`,
    headline: `Awesome ${l}`,
  }),
  learning: (l) => ({
    title: `AI for Biology ${l} — Learn BioAI | BioAI Nav`,
    description: `Curated ${l.toLowerCase()} for learning AI in biology and biotech — from first principles to frontier methods.`,
    headline: `AI for Biology — ${l}`,
  }),
}

const SUB_SEO_ZH: Record<string, SubSeoFn> = {
  tools: (l, n) => ({
    title: `最佳${l} AI 工具——精选 ${n} 款 | BioAI Nav`,
    description: `${n} 款人工核实的${l} AI 工具：开源状态、GitHub 仓库与智能体友好度一目了然。`,
    headline: `${l} AI 工具`,
  }),
  agents: (l, n) => ({
    title: `${l} AI 智能体——开源项目精选 | BioAI Nav`,
    description: `${n}+ 个面向${l}的 AI 智能体：真正在干生物学活的开源项目、框架与科研系统。`,
    headline: `${l} AI 智能体`,
  }),
  models: (l, n) => ({
    title: `${l} AI 模型——BioAI 基础模型 | BioAI Nav`,
    description: `${n} 个${l} AI 模型：权重、论文、API 与仓库，BioAI Nav 人工核实。`,
    headline: `${l} AI 模型`,
  }),
  platforms: (l, n) => ({
    title: `AI${l}平台——BioAI 平台导航 | BioAI Nav`,
    description: `BioAI 生态中的 ${n} 个 AI${l}平台：每个平台实际交付什么、哪些公开可用。`,
    headline: `AI${l}平台`,
  }),
  datasets: (l) => ({
    title: `${l}数据集——AI 生物学数据资源 | BioAI Nav`,
    description: `AI 生物学领域的${l}数据集：内容、授权与获取入口，BioAI Nav 人工核实。`,
    headline: `${l}数据集`,
  }),
  skills: (l, n, sub) =>
    sub === 'mcp'
      ? {
          title: '生物学 MCP 服务器——智能体技能与工具 | BioAI Nav',
          description: `${n} 个让 AI 智能体直接操作序列、结构与生物信息学工具的 MCP 服务器——兼容 Claude Code、OpenClaw、Codex 与 Gemini CLI。`,
          headline: '生物学 MCP 服务器',
        }
      : sub === 'general'
        ? {
            title: '生物智能体技能——技能库与技能包 | BioAI Nav',
            description: `${n} 个给编码智能体装上生物学与生物信息学能力的技能库与技能包——覆盖 OpenClaw、Claude Code、Codex 等。`,
            headline: '生物智能体技能',
          }
        : {
            title: `${l}生物技能——生物学智能体技能 | BioAI Nav`,
            description: `面向${l}的生物智能体技能与 MCP 服务器：给编码智能体装上生物学能力。`,
            headline: `${l}生物智能体技能`,
          },
  awesome: (l) => ({
    title: `Awesome ${l}——GitHub 精选清单 | BioAI Nav`,
    description: `GitHub 上整理${l}版图的 awesome 清单——社区维护、值得星标。`,
    headline: `Awesome ${l}`,
  }),
  learning: (l) => ({
    title: `AI 生物学${l}——学习资源 | BioAI Nav`,
    description: `学习 AI 生物学的精选${l}——从入门原理到前沿方法。`,
    headline: `AI 生物学${l}`,
  }),
}

export function subcategorySeo(categorySlug: string, subSlug: string, count: number, locale: Locale = 'en') {
  const meta = getCategory(categorySlug)
  const label = meta ? subcategoryLabel(meta, subSlug, locale) : subSlug
  const fn = (locale === 'zh' ? SUB_SEO_ZH : SUB_SEO_EN)[categorySlug]
  if (fn) return fn(label, count, subSlug)
  return {
    title: `${label} | BioAI Nav`,
    description: `Curated ${label} resources in the BioAI ecosystem.`,
    headline: label,
  }
}

// 资源 type → 展示标签（中英）
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
  framework: 'Framework',
  'skill-collection': 'Skill Collection',
}

export const TYPE_LABELS_ZH: Record<string, string> = {
  directory: '目录站',
  'skill-library': '技能库',
  'awesome-list': 'Awesome 清单',
  'mcp-server': 'MCP 服务器',
  agent: 'AI 智能体',
  tool: '工具',
  model: '模型',
  platform: '平台',
  dataset: '数据集',
  course: '课程',
  book: '书籍',
  tutorial: '教程',
  docs: '文档',
  paper: '论文 / 综述',
  lecture: '讲座',
  github: '仓库',
  framework: '智能体框架',
  'skill-collection': '技能合集',
}
