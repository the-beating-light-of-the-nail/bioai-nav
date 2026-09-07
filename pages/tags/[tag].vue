<script setup lang="ts">
import { byTag, validTags } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd, useJsonLd, collectionJsonLd, tagLabel } from '~/composables/seo'

const route = useRoute()
const tagParam = (route.params.tag as string).toLowerCase()

const entry = validTags().find((t) => t.slug === tagParam)
if (!entry) {
  throw createError({ statusCode: 404, statusMessage: 'Tag not found', fatal: true })
}

const list = byTag(tagParam)
const label = tagLabel(tagParam)
const otherTags = validTags()
  .filter((t) => t.slug !== tagParam)
  .slice(0, 12)

usePageSeo({
  title: `${label} — BioAI Resources, Tools & Agents | BioAI Nav`,
  description: `${entry.count} curated ${label.toLowerCase()} resources in the BioAI ecosystem: tools, agents, datasets, skills and learning materials — verified links, open-source status and agent-readiness.`,
  path: `/tags/${tagParam}`,
})
useBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Tags', path: '/tags' },
  { name: label, path: `/tags/${tagParam}` },
])
useJsonLd(
  collectionJsonLd({
    name: `${label} — BioAI resources`,
    description: `${entry.count} curated ${label.toLowerCase()} resources for AI in biology and biotech.`,
    path: `/tags/${tagParam}`,
    resources: list,
  }),
)
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink to="/tags">Tags</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ label }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ label }}</h1>
      <p class="page-tagline">{{ entry.count }} curated resources across every BioAI Nav category</p>
    </header>

    <div class="page-intro prose">
      <p>
        Everything we have cataloged under <b>{{ label.toLowerCase() }}</b> — spanning AI tools, agents, skills, models,
        datasets and learning resources. Use the filters to narrow by open-source status, agent-readiness or MCP
        support.
      </p>
    </div>

    <ListingExplorer :resources="list" show-category />

    <section class="link-cloud-block">
      <h2 class="cloud-title">Related topics</h2>
      <div class="link-cloud">
        <NuxtLink v-for="t in otherTags" :key="t.slug" :to="`/tags/${t.slug}`" class="cloud-link">
          {{ tagLabel(t.slug) }} <i>{{ t.count }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
