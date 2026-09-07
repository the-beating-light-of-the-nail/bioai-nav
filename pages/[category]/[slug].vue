<script setup lang="ts">
import { getCategory, catText, subcategoryLabel, subcategorySeo } from '~/data/categories'
import {
  byCategory,
  findResource,
  relatedResources,
  resourceText,
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
const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

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
const text = computed(() => (resource ? resourceText(resource, loc.value) : null))
const aboutParagraphs = computed(() => {
  const ld = text.value?.longDescription
  if (!ld) return []
  return Array.isArray(ld) ? ld : String(ld).split(/\n\n+/)
})
const subLabel = computed(() =>
  resource?.subcategory ? subcategoryLabel(meta!, resource.subcategory, loc.value) : null,
)
const catTexts = computed(() => catText(meta!, loc.value))

/* ---------- 子类目聚合页模式 ---------- */
const subList = isSubPage ? byCategory(catSlug).filter((r) => r.subcategory === slugParam) : []
const subLabelForPage = isSubPage ? subcategoryLabel(meta!, slugParam, loc.value) : ''
const subSeo = isSubPage ? subcategorySeo(catSlug, subLabelForPage, subCount, loc.value) : null
const subSeoEn = isSubPage ? subcategorySeo(catSlug, subcategoryLabel(meta!, slugParam, 'en'), subCount, 'en') : null

const pageTitle = resource
  ? loc.value === 'zh'
    ? `${resource.name}——${typeLabel(resource.type, 'zh')}${subLabel.value ? ' · ' + subLabel.value : ''} | BioAI Nav`
    : `${resource.name} — ${typeLabel(resource.type, 'en')}${subLabel.value ? ' · ' + subLabel.value : ''} | BioAI Nav`
  : subSeo!.title
const pageDesc = resource ? text.value!.description : subSeo!.description

usePageSeo({
  title: pageTitle,
  description: pageDesc,
  ogType: resource && resource.type === 'paper' ? 'article' : 'website',
})
useBreadcrumbJsonLd(
  resource
    ? [
        { name: t('common.home'), path: localePath('/') },
        { name: catTexts.value.title, path: localePath(`/${catSlug}`) },
        { name: resource.name, path: localePath(`/${catSlug}/${slugParam}`) },
      ]
    : [
        { name: t('common.home'), path: localePath('/') },
        { name: catTexts.value.title, path: localePath(`/${catSlug}`) },
        { name: subLabelForPage, path: localePath(`/${catSlug}/${slugParam}`) },
      ],
)
useJsonLd(
  resource
    ? resourceJsonLd({ ...resource, description: text.value!.description })
    : collectionJsonLd({
        name: subSeoEn!.headline,
        description: subSeoEn!.description,
        path: localePath(`/${catSlug}/${slugParam}`),
        resources: subList,
      }),
)

const subpageBackName = computed(() =>
  loc.value === 'zh' ? catTexts.value.headline : catTexts.value.headline,
)
</script>

<template>
  <!-- ==================== 资源详情页 ==================== -->
  <div v-if="resource" class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="localePath(`/${catSlug}`)">{{ catTexts.title }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ resource.name }}</span>
    </nav>

    <header class="detail-head">
      <ResourceAvatar :name="resource.name" :size="60" />
      <div class="detail-head-main">
        <h1 class="page-title">{{ resource.name }}</h1>
        <p class="detail-sub">
          <span class="type-chip">{{ typeLabel(resource.type, loc) }}</span>
          <span v-if="subLabel" class="detail-sub-item">{{ subLabel }}</span>
          <span v-if="resource.publisher" class="detail-sub-item">{{ resource.publisher }}</span>
        </p>
        <p class="detail-lead">{{ text!.description }}</p>
        <TraitChips :resource="resource" />
        <div class="detail-actions">
          <a class="btn btn-primary" :href="resource.url" target="_blank" rel="noopener noreferrer">
            {{ t('detail.visit') }} <span aria-hidden="true">↗</span>
          </a>
          <a
            v-if="resource.github"
            class="btn btn-ghost"
            :href="resource.github"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('detail.github') }}
          </a>
        </div>
      </div>
    </header>

    <div class="detail-body">
      <div class="detail-main">
        <section v-if="aboutParagraphs.length" class="detail-section prose">
          <h2>{{ t('detail.about', { name: resource.name }) }}</h2>
          <p v-for="(p, i) in aboutParagraphs" :key="i">{{ p }}</p>
        </section>

        <section v-if="related.length" class="detail-section">
          <h2>{{ t('detail.similar') }}</h2>
          <div class="cards">
            <ResourceCard v-for="r in related" :key="r.category + '/' + r.slug" :resource="r" show-category />
          </div>
        </section>

        <p class="detail-note">
          {{ t('detail.note') }}
          <NuxtLink :to="localePath('/submit')">{{ t('detail.noteLink') }}</NuxtLink>
          {{ t('detail.noteSuffix') }}
        </p>
      </div>

      <aside class="detail-aside">
        <h2 class="aside-title">{{ t('detail.glance') }}</h2>
        <dl class="meta-list">
          <div class="meta-row">
            <dt>{{ t('detail.category') }}</dt>
            <dd><NuxtLink :to="localePath(`/${catSlug}`)">{{ catTexts.title }}</NuxtLink></dd>
          </div>
          <div v-if="subLabel" class="meta-row">
            <dt>{{ t('detail.subcategory') }}</dt>
            <dd>{{ subLabel }}</dd>
          </div>
          <div class="meta-row">
            <dt>{{ t('detail.type') }}</dt>
            <dd>{{ typeLabel(resource.type, loc) }}</dd>
          </div>
          <div v-if="resource.publisher" class="meta-row">
            <dt>{{ t('detail.publisher') }}</dt>
            <dd>{{ resource.publisher }}</dd>
          </div>
          <div v-if="resource.language" class="meta-row">
            <dt>{{ t('detail.language') }}</dt>
            <dd>{{ resource.language }}</dd>
          </div>
          <div v-if="resource.license" class="meta-row">
            <dt>{{ t('detail.license') }}</dt>
            <dd>{{ resource.license }}</dd>
          </div>
          <div v-if="resource.stars" class="meta-row">
            <dt>{{ t('detail.stars') }}</dt>
            <dd>★ {{ formatStars(resource.stars) }}</dd>
          </div>
          <div class="meta-row">
            <dt>{{ t('detail.oss') }}</dt>
            <dd>{{ resource.openSource ? t('detail.yes') : t('detail.no') }}</dd>
          </div>
          <div class="meta-row">
            <dt>{{ t('detail.agent') }}</dt>
            <dd>{{ resource.agentSupport ? t('detail.yes') : t('detail.none') }}</dd>
          </div>
          <div class="meta-row">
            <dt>{{ t('detail.mcp') }}</dt>
            <dd>{{ resource.mcp ? t('detail.yes') : t('detail.none') }}</dd>
          </div>
          <div class="meta-row">
            <dt>{{ t('detail.openclaw') }}</dt>
            <dd>{{ resource.openclaw ? t('detail.yes') : t('detail.none') }}</dd>
          </div>
          <div v-if="resource.addedAt" class="meta-row">
            <dt>{{ t('detail.added') }}</dt>
            <dd>{{ resource.addedAt }}</dd>
          </div>
        </dl>

        <div v-if="resource.tags && resource.tags.length" class="aside-tags">
          <h2 class="aside-title">{{ t('detail.tags') }}</h2>
          <div class="tag-cloud">
            <NuxtLink
              v-for="tag in resource.tags"
              :key="tag"
              class="tag-chip"
              :to="localePath(`/tags/${tag.toLowerCase()}`)"
            >
              {{ tagLabel(tag, loc) }}
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- ==================== 子类目聚合页 ==================== -->
  <div v-else class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="localePath(`/${catSlug}`)">{{ catTexts.title }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ subLabelForPage }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ subSeo!.headline }}</h1>
      <p class="page-tagline">{{ t('subpage.headSuffix', { n: subCount, cat: catTexts.title }) }}</p>
    </header>

    <div class="page-intro prose">
      <p>{{ t('subpage.intro1', { n: subCount, sub: subLabelForPage, cat: catTexts.title }) }}</p>
      <i18n-t keypath="subpage.intro2" tag="p" scope="global">
        <template #cat>
          <NuxtLink :to="localePath(`/${catSlug}`)">{{ catTexts.headline }}</NuxtLink>
        </template>
        <template #home>
          <NuxtLink :to="localePath('/')">{{ t('subpage.homeLink') }}</NuxtLink>
        </template>
      </i18n-t>
    </div>

    <ListingExplorer :resources="subList" show-category />

    <section class="link-cloud-block">
      <h2 class="cloud-title">{{ t('cloud.relatedSubs') }}</h2>
      <div class="link-cloud">
        <NuxtLink
          v-for="s in subcategoryCounts(catSlug).filter((x) => x.count >= SUBCAT_PAGE_MIN)"
          :key="s.slug"
          :to="localePath(`/${catSlug}/${s.slug}`)"
          class="cloud-link"
        >
          {{ subcategoryLabel(meta!, s.slug, loc) }}
          <i>{{ s.count }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
