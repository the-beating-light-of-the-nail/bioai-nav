<script setup lang="ts">
import { validTags } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd, tagLabel } from '~/composables/seo'

const tags = validTags()

usePageSeo({
  title: 'Browse BioAI Resources by Tag | BioAI Nav',
  description:
    'All BioAI Nav topics at a glance: drug discovery, protein design, bioinformatics, genomics, single cell, agent skills, MCP and more — browse curated resources by tag.',
  path: '/tags',
})
useBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Tags', path: '/tags' },
])
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">Tags</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">Browse by tag</h1>
      <p class="page-tagline">{{ tags.length }} topics across the BioAI ecosystem</p>
    </header>

    <div class="page-intro prose">
      <p>
        Tags cut across categories: a topic like <b>drug discovery</b> spans tools, agents, datasets, awesome lists and
        learning resources. Each tag below has its own curated page.
      </p>
    </div>

    <div class="link-cloud link-cloud-lg">
      <NuxtLink v-for="t in tags" :key="t.slug" :to="`/tags/${t.slug}`" class="cloud-link">
        {{ tagLabel(t.slug) }} <i>{{ t.count }}</i>
      </NuxtLink>
    </div>
  </div>
</template>
