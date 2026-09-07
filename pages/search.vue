<script setup lang="ts">
import { resources } from '~/data/load'
import { usePageSeo } from '~/composables/seo'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')

usePageSeo({
  title: isZh.value ? '搜索 BioAI 资源 | BioAI Nav' : 'Search BioAI Resources | BioAI Nav',
  description: isZh.value
    ? '搜索 BioAI Nav 目录：AI 工具、智能体、技能、Awesome 清单、模型、平台、GitHub 项目、数据集与学习资源。'
    : 'Search the BioAI Nav catalog: AI tools, agents, skills, awesome lists, models, platforms, GitHub projects, datasets and learning resources for biology and biotech.',
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
      <h1 class="page-title">{{ t('search.title') }}</h1>
      <p class="page-tagline">{{ t('search.sub', { n: resources.length }) }}</p>
    </header>

    <ListingExplorer :resources="resources" show-category :initial-query="initialQuery" />
  </div>
</template>
