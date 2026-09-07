# AGENTS.md — BioAI Nav

定位/命令/数据链路详见 README.md，这里是维护红线：

- **部署 = 本地 `npm run deploy`，与 git 推送彻底解耦**（Cloudflare Workers 静态资产直传）。改完代码必须 generate 成功 + `npm run check` 通过才能 deploy。
- **npm 安装必须带 `--legacy-peer-deps`**（本机 npm 10.8.2 的 edgesOut bug，换 npm 版本前别摘掉）。
- **双语站**：en 无前缀 / zh 带 `/zh` 前缀；新增页面必须两语言都能渲染（预渲染种子自动 ×2，check 脚本会校验）。中文资源介绍放 `data/resources-zh/`（平行覆盖目录，只存 description/longDescription），别把 zh 字段塞进英文数据文件。
- **新增资源只加 `data/resources/<category>/<slug>.json`**，不要手改 `.output/`、`data/generated/`（split 脚本产物）。
- category=github 是虚拟视图，永远不出现在数据文件；子类目 slug 必须在 `data/categories.ts` 词表内，split 脚本会校验。
- 聚合页门槛三处同步：`nuxt.config.ts` / `data/load.ts` / `scripts/check-prerender.mjs`（改一处必须三处一起）。
- `data/categories.ts` 的 `SITE.url` 是全站域名唯一来源（canonical/OG/sitemap/robots 都从这里走 runtimeConfig）。
- Worker 密钥只放 wrangler secrets 与本地 `.dev.vars`（gitignore）；Upstash 用共享实例，key 一律 `bioainav:` 前缀。
- 投稿是「暂存队列 + 人工终审」，不要加自动收录。
- 文档与 commit message 用中文，conventional 前缀（feat/chore/content）。
