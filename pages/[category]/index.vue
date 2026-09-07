<script setup lang="ts">
import { getCategory } from '~/data/categories'
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
const catSlug = route.params.category as string
const meta = getCategory(catSlug)
if (!meta) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const list = byCategory(catSlug) as (Resource & { category: string })[]

const subOptions = subcategoryCounts(catSlug).map((s) => ({
  slug: s.slug,
  count: s.count,
  label: meta.subcategories?.find((x) => x.slug === s.slug)?.label || tagLabel(s.slug),
}))

// SEO 内链：够门槛的子类目聚合页 + 本分类下资源最多的标签
const pageSubs = validSubcategories(catSlug, SUBCAT_PAGE_MIN).map((s) => ({
  ...s,
  label: meta.subcategories?.find((x) => x.slug === s.slug)?.label || tagLabel(s.slug),
}))

const tagCountsByCat = new Map<string, number>()
for (const r of list) {
  for (const t of r.tags || []) {
    const k = t.toLowerCase()
    tagCountsByCat.set(k, (tagCountsByCat.get(k) || 0) + 1)
  }
}
const validTagSet = new Set(validTags(TAG_PAGE_MIN).map((t) => t.slug))
const catTags = [...tagCountsByCat.entries()]
  .filter(([slug, n]) => validTagSet.has(slug) && n >= 2)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 14)

usePageSeo({ title: meta.seoTitle, description: meta.seoDescription, path: `/${catSlug}` })
useBreadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: meta.title, path: `/${catSlug}` }])
useJsonLd(collectionJsonLd({ name: meta.headline, description: meta.seoDescription, path: `/${catSlug}`, resources: list }))

</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ meta.title }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ meta.headline }}</h1>
      <p class="page-tagline">{{ meta.tagline }}</p>
      <p class="page-count">{{ list.length }} curated resources</p>
    </header>

    <div class="page-intro prose">
      <p v-for="(p, i) in meta.intro" :key="i">{{ p }}</p>
    </div>

    <ListingExplorer :resources="list" :subcategories="subOptions" />

    <section v-if="pageSubs.length" class="link-cloud-block">
      <h2 class="cloud-title">Explore {{ meta.title.toLowerCase() }} by subcategory</h2>
      <div class="link-cloud">
        <NuxtLink v-for="s in pageSubs" :key="s.slug" :to="`/${catSlug}/${s.slug}`" class="cloud-link">
          {{ s.label }} <i>{{ s.count }}</i>
        </NuxtLink>
      </div>
    </section>

    <section v-if="catTags.length" class="link-cloud-block">
      <h2 class="cloud-title">Popular tags in {{ meta.title.toLowerCase() }}</h2>
      <div class="link-cloud">
        <NuxtLink v-for="t in catTags" :key="t[0]" :to="`/tags/${t[0]}`" class="cloud-link">
          {{ tagLabel(t[0]) }} <i>{{ t[1] }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
