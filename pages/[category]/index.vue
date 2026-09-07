<script setup lang="ts">
import { getCategory, catText, subcategoryLabel } from '~/data/categories'
import {
  byCategory,
  subcategoryCounts,
  validSubcategories,
  validTags,
  SUBCAT_PAGE_MIN,
  TAG_PAGE_MIN,
  type Resource,
} from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd, useJsonLd, collectionJsonLd, tagLabel } from '~/composables/seo'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

const catSlug = route.params.category as string
const meta = getCategory(catSlug)
if (!meta) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const text = computed(() => catText(meta!, loc.value))
const list = byCategory(catSlug) as (Resource & { category: string })[]

const subOptions = computed(() =>
  subcategoryCounts(catSlug).map((s) => ({
    slug: s.slug,
    count: s.count,
    label: subcategoryLabel(meta!, s.slug, loc.value),
  })),
)

// SEO 内链：够门槛的子类目聚合页 + 本分类下资源最多的标签
const pageSubs = computed(() =>
  validSubcategories(catSlug, SUBCAT_PAGE_MIN).map((s) => ({
    ...s,
    label: subcategoryLabel(meta!, s.slug, loc.value),
  })),
)

const tagCountsByCat = new Map<string, number>()
for (const r of list) {
  for (const tag of r.tags || []) {
    const k = tag.toLowerCase()
    tagCountsByCat.set(k, (tagCountsByCat.get(k) || 0) + 1)
  }
}
const validTagSet = new Set(validTags(TAG_PAGE_MIN).map((x) => x.slug))
const catTags = [...tagCountsByCat.entries()]
  .filter(([slug, n]) => validTagSet.has(slug) && n >= 2)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 14)

usePageSeo({ title: text.value.seoTitle, description: text.value.seoDescription })
useBreadcrumbJsonLd([
  { name: t('common.home'), path: localePath('/') },
  { name: text.value.title, path: localePath(`/${catSlug}`) },
])
useJsonLd(
  collectionJsonLd({
    name: text.value.headline,
    description: text.value.seoDescription,
    path: localePath(`/${catSlug}`),
    resources: list,
  }),
)

const cloudCatName = computed(() => (loc.value === 'zh' ? text.value.title : text.value.title.toLowerCase()))
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ text.title }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ text.headline }}</h1>
      <p class="page-tagline">{{ text.tagline }}</p>
      <p class="page-count">{{ t('common.resources', { n: list.length }) }}</p>
    </header>

    <div class="page-intro prose">
      <p v-for="(p, i) in text.intro" :key="i">{{ p }}</p>
    </div>

    <ListingExplorer :resources="list" :subcategories="subOptions" />

    <section v-if="pageSubs.length" class="link-cloud-block">
      <h2 class="cloud-title">{{ t('cloud.exploreSub', { cat: cloudCatName }) }}</h2>
      <div class="link-cloud">
        <NuxtLink v-for="s in pageSubs" :key="s.slug" :to="localePath(`/${catSlug}/${s.slug}`)" class="cloud-link">
          {{ s.label }} <i>{{ s.count }}</i>
        </NuxtLink>
      </div>
    </section>

    <section v-if="catTags.length" class="link-cloud-block">
      <h2 class="cloud-title">{{ t('cloud.popularTags', { cat: cloudCatName }) }}</h2>
      <div class="link-cloud">
        <NuxtLink v-for="x in catTags" :key="x[0]" :to="localePath(`/tags/${x[0]}`)" class="cloud-link">
          {{ tagLabel(x[0], loc) }} <i>{{ x[1] }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
