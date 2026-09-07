# BioAI Nav — The Navigation Hub for AI in Biology & Biotech

线上地址：**https://bioainav.aiworkagent.org**（Cloudflare Workers，静态资产直传）

> BioAI 领域的「导航的导航」：不与现有工具目录竞争，而是帮用户发现整个生态中的
> Directories、Agent Skills、Awesome Lists、Agents、Tools、Models、Platforms、GitHub、
> Datasets 与 Learning Resources。**The discovery layer of the BioAI ecosystem.**

## 技术栈

- **Nuxt 3 SSG**（`nuxt generate` → `.output/public`，全静态、SEO 优先、零运行时 SSR）
- **Cloudflare Workers**（`worker/index.js`：`/api/submit` 投稿 + `/api/submissions` 管理读取；其余全部走静态资产）
- **Upstash Redis**（共享实例，key 前缀 `bioainav:`，存投稿队列 + 限频）
- 数据层：`data/resources/<category>/<slug>.json`，**一文件一资源**，新增资源不需要改任何代码
- 样式：手写设计系统 `assets/css/main.css`（无 CSS 框架），字体 Inter Variable 自托管

## 常用命令

```bash
npm install --legacy-peer-deps   # 本机 npm 10.8.2 装 nuxt 依赖必须带此参数（edgesOut bug）
npm run dev                      # 本地开发
npm run generate                 # 全量预渲染（~170 页）
npm run check                    # 预渲染产物校验（对照 data/resources 逐页检查）
npx serve .output/public         # 本地预览构建产物
npm run deploy                   # generate + check + wrangler deploy（正式上线）
```

## 数据维护

- **新增一个资源 = 新增一个 JSON 文件**：`data/resources/<category>/<slug>.json`，
  字段参考 `data/load.ts` 的 `Resource` 接口（name/slug/category/subcategory/type/description/
  longDescription/url/github/tags/openSource/agentSupport/mcp/openclaw/featured/publisher/
  language/stars/license/addedAt/status）。
- category 限定 9 个真实分类（github 是跨分类虚拟视图，聚合所有带 github 的资源，禁止出现在数据里）；
  子类目词表在 `data/categories.ts`（改动它会同时影响导航、SEO 文案与聚合页生成）。
- 批量导入/重建：把数组放进 `scripts/merged/*.json` 再跑 `node scripts/split-resources.mjs`
  （顺带产出 `data/generated/all-resources.json` 供 sitemap 服务端路由静态导入）。
- **聚合页门槛**（避免薄页面）：子类目 ≥3 个资源才生成 `/{category}/{sub}`，标签 ≥4 个资源才生成 `/tags/{tag}`。
  门槛在 `nuxt.config.ts`、`data/load.ts`、`scripts/check-prerender.mjs` 三处同步（SUBCAT_PAGE_MIN/TAG_PAGE_MIN）。
- 首页 Featured 是人工精选：`scripts/split-resources.mjs` 里的 `FEATURED` 集合。

## 投稿链路

- 前端 `/submit` 表单 → `POST /api/submit`（Worker）→ Upstash `bioainav:submissions` 队列
  （每 IP 每小时 5 次，Redis 故障 fail-open；IP 只存 HMAC 哈希）。
- 管理员取队列：`curl -H "Authorization: Bearer $BIOAINAV_ADMIN_TOKEN" https://bioainav.aiworkagent.org/api/submissions`
  （`?clear=1` 清空，`?take=N` 条数）。审核通过后往 `data/resources/` 加文件 → `npm run deploy`。

## Worker secrets（3 个）

`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` / `BIOAINAV_ADMIN_TOKEN`（本地等值在 `.dev.vars`，已 gitignore）。
线上经 `wrangler secret put` 写入；admin token 同时是 IP 哈希的 HMAC 密钥，换了它旧哈希作废（无影响）。

## SEO 要点

- 全站 SSG；每页 canonical/OG/Twitter 卡；列表页 CollectionPage+ItemList+Breadcrumb JSON-LD，
  详情页按 type 映射 SoftwareApplication/Dataset/Course/Book/ScholarlyArticle 等，首页 WebSite+SearchAction。
- sitemap（167+ URL）与 robots 由 `server/routes/` 生成，数据源与页面一致；`/search` noindex。
- 域名硬编码只存在于 `data/categories.ts` 的 `SITE.url`（runtimeConfig 同源覆盖）——换域名改一处。

## 路线图（未做）

- GitHub stars/last-updated 定期刷新（P1，GitHub API 批量脚本）
- 中文版（结构已预留：文案集中在页面与 categories.ts，无硬编码散落）
- og:image 生成（当前 OG 卡为纯文本）
- IndexNow / Search Console 提交
