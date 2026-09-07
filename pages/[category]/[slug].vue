<script setup lang="ts">
import { getCategory, subcategorySeo } from '~/data/categories'
import {
  byCategory,
  findResource,
  relatedResources,
  subcategoryCounts,
  SUBCAT_PAGE_MIN,
} from '~/data/load'
import {
  usePageSeo,
  useBreadcrumbJsonLd,
  useJsonLd,
  collectionJsonLd,
  resourceJsonLd,
  typeLabel,
  tagLabel,
  formatStars,
} from '~/composables/seo'

const route = useRoute()
const catSlug = route.params.category as string
const slugParam = (route.params.slug as string).toLowerCase()

const meta = getCategory(catSlug)
if (!meta) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

// 双模式路由：/{category}/{slug} 优先匹配资源详情页；
// 否则若是足够多资源的子类目 slug，则渲染子类目聚合页（程序化 SEO 页）
const resource = findResource(catSlug, slugParam)
const subCount = subcategoryCounts(catSlug).find((s) => s.slug === slugParam)?.count || 0
const subMeta = meta.subcategories?.find((s) => s.slug === slugParam)
const isSubPage = !resource && !!subMeta && subCount >= SUBCAT_PAGE_MIN

if (!resource && !isSubPage) {
  throw createError({ statusCode: 404, statusMessage: 'Resource not found', fatal: true })
}

/* ---------- 详情页模式 ---------- */
const related = resource ? relatedResources(resource, 6) : []
const aboutParagraphs = computed(() => {
  if (!resource?.longDescription) return []
  const raw = resource.longDescription
  return Array.isArray(raw) ? raw : raw.split(/\n\n+/)
})
const subLabel = meta.subcategories?.find((s) => s.slug === resource?.subcategory)?.label

/* ---------- 子类目聚合页模式 ---------- */
const subList = isSubPage ? byCategory(catSlug).filter((r) => r.subcategory === slugParam) : []
const subSeo = isSubPage ? subcategorySeo(catSlug, subMeta!.label, subCount) : null

const pageTitle = resource
  ? `${resource.name} — ${typeLabel(resource.type)}${subLabel ? ' · ' + subLabel : ''} | BioAI Nav`
  : subSeo!.title
const pageDesc = resource ? resource.description : subSeo!.description
const pagePath = `/${catSlug}/${slugParam}`

usePageSeo({ title: pageTitle, description: pageDesc, path: pagePath, ogType: resource && resource.type === 'paper' ? 'article' : 'website' })
useBreadcrumbJsonLd(
  resource
    ? [
        { name: 'Home', path: '/' },
        { name: meta.title, path: `/${catSlug}` },
        { name: resource.name, path: pagePath },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: meta.title, path: `/${catSlug}` },
        { name: subMeta!.label, path: pagePath },
      ],
)
useJsonLd(
  resource
    ? resourceJsonLd(resource)
    : collectionJsonLd({ name: subSeo!.headline, description: subSeo!.description, path: pagePath, resources: subList }),
)
</script>

<template>
  <!-- ==================== 资源详情页 ==================== -->
  <div v-if="resource" class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="`/${catSlug}`">{{ meta.title }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ resource.name }}</span>
    </nav>

    <header class="detail-head">
      <ResourceAvatar :name="resource.name" :size="60" />
      <div class="detail-head-main">
        <h1 class="page-title">{{ resource.name }}</h1>
        <p class="detail-sub">
          <span class="type-chip">{{ typeLabel(resource.type) }}</span>
          <span v-if="subLabel" class="detail-sub-item">{{ subLabel }}</span>
          <span v-if="resource.publisher" class="detail-sub-item">{{ resource.publisher }}</span>
        </p>
        <p class="detail-lead">{{ resource.description }}</p>
        <TraitChips :resource="resource" />
        <div class="detail-actions">
          <a class="btn btn-primary" :href="resource.url" target="_blank" rel="noopener noreferrer">
            Visit website <span aria-hidden="true">↗</span>
          </a>
          <a
            v-if="resource.github"
            class="btn btn-ghost"
            :href="resource.github"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
        </div>
      </div>
    </header>

    <div class="detail-body">
      <div class="detail-main">
        <section v-if="aboutParagraphs.length" class="detail-section prose">
          <h2>About {{ resource.name }}</h2>
          <p v-for="(p, i) in aboutParagraphs" :key="i">{{ p }}</p>
        </section>

        <section v-if="related.length" class="detail-section">
          <h2>Similar resources</h2>
          <div class="cards">
            <ResourceCard v-for="r in related" :key="r.category + '/' + r.slug" :resource="r" show-category />
          </div>
        </section>

        <p class="detail-note">
          Spot something wrong or outdated?
          <NuxtLink to="/submit">Submit a correction</NuxtLink> — every listing is human-reviewed.
        </p>
      </div>

      <aside class="detail-aside">
        <h2 class="aside-title">At a glance</h2>
        <dl class="meta-list">
          <div class="meta-row">
            <dt>Category</dt>
            <dd><NuxtLink :to="`/${catSlug}`">{{ meta.title }}</NuxtLink></dd>
          </div>
          <div v-if="subLabel" class="meta-row">
            <dt>Subcategory</dt>
            <dd>{{ subLabel }}</dd>
          </div>
          <div class="meta-row">
            <dt>Resource type</dt>
            <dd>{{ typeLabel(resource.type) }}</dd>
          </div>
          <div v-if="resource.publisher" class="meta-row">
            <dt>Publisher</dt>
            <dd>{{ resource.publisher }}</dd>
          </div>
          <div v-if="resource.language" class="meta-row">
            <dt>Language</dt>
            <dd>{{ resource.language }}</dd>
          </div>
          <div v-if="resource.license" class="meta-row">
            <dt>License</dt>
            <dd>{{ resource.license }}</dd>
          </div>
          <div v-if="resource.stars" class="meta-row">
            <dt>GitHub stars</dt>
            <dd>★ {{ formatStars(resource.stars) }}</dd>
          </div>
          <div class="meta-row">
            <dt>Open source</dt>
            <dd>{{ resource.openSource ? 'Yes' : 'No / proprietary' }}</dd>
          </div>
          <div class="meta-row">
            <dt>Agent support</dt>
            <dd>{{ resource.agentSupport ? 'Yes' : '—' }}</dd>
          </div>
          <div class="meta-row">
            <dt>MCP</dt>
            <dd>{{ resource.mcp ? 'Yes' : '—' }}</dd>
          </div>
          <div class="meta-row">
            <dt>OpenClaw</dt>
            <dd>{{ resource.openclaw ? 'Yes' : '—' }}</dd>
          </div>
          <div v-if="resource.addedAt" class="meta-row">
            <dt>Added</dt>
            <dd>{{ resource.addedAt }}</dd>
          </div>
        </dl>

        <div v-if="resource.tags && resource.tags.length" class="aside-tags">
          <h2 class="aside-title">Tags</h2>
          <div class="tag-cloud">
            <NuxtLink
              v-for="t in resource.tags"
              :key="t"
              class="tag-chip"
              :to="`/tags/${t.toLowerCase()}`"
            >
              {{ tagLabel(t) }}
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- ==================== 子类目聚合页 ==================== -->
  <div v-else class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="`/${catSlug}`">{{ meta.title }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ subMeta!.label }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ subSeo!.headline }}</h1>
      <p class="page-tagline">{{ subCount }} curated resources · part of {{ meta.headline }}</p>
    </header>

    <div class="page-intro prose">
      <p>
        A focused slice of the BioAI ecosystem: {{ subCount }} curated
        {{ subMeta!.label.toLowerCase() }} resources from our {{ meta.title.toLowerCase() }} section, each verified for
        a working official link and honest metadata — open-source status, GitHub repository and agent-readiness.
      </p>
      <p>
        Looking for something broader? Head back to
        <NuxtLink :to="`/${catSlug}`">{{ meta.headline }}</NuxtLink> or browse every category from the
        <NuxtLink to="/">BioAI Nav home page</NuxtLink>.
      </p>
    </div>

    <ListingExplorer :resources="subList" show-category />

    <section class="link-cloud-block">
      <h2 class="cloud-title">Related subcategories</h2>
      <div class="link-cloud">
        <NuxtLink
          v-for="s in subcategoryCounts(catSlug).filter((x) => x.count >= SUBCAT_PAGE_MIN)"
          :key="s.slug"
          :to="`/${catSlug}/${s.slug}`"
          class="cloud-link"
        >
          {{ meta.subcategories?.find((x) => x.slug === s.slug)?.label || tagLabel(s.slug) }}
          <i>{{ s.count }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
