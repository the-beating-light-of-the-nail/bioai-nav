<script setup lang="ts">
import { resources } from '~/data/load'
import { usePageSeo } from '~/composables/seo'

usePageSeo({
  title: 'Search BioAI Resources | BioAI Nav',
  description:
    'Search the BioAI Nav catalog: AI tools, agents, skills, awesome lists, models, platforms, GitHub projects, datasets and learning resources for biology and biotech.',
  path: '/search',
})
useSeoMeta({ robots: 'noindex, follow' })

const route = useRoute()
const initialQuery = ref('')

// SSR 输出全量列表（无 query），挂载后再吸收 URL 参数，避免水合不一致
onMounted(() => {
  initialQuery.value = (route.query.q as string) || ''
})
</script>

<template>
  <div class="container page">
    <header class="page-head">
      <h1 class="page-title">Search BioAI resources</h1>
      <p class="page-tagline">
        {{ resources.length }} resources · matches names, descriptions, tags, categories, publishers and GitHub repos
      </p>
    </header>

    <ListingExplorer :resources="resources" show-category :initial-query="initialQuery" />
  </div>
</template>
