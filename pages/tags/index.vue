<script setup lang="ts">
import { validTags } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd, tagLabel } from '~/composables/seo'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

const tags = validTags()
const isZh = loc.value === 'zh'

usePageSeo({
  title: isZh ? '按标签浏览 BioAI 资源 | BioAI Nav' : 'Browse BioAI Resources by Tag | BioAI Nav',
  description: isZh
    ? 'BioAI Nav 全部主题一览：药物发现、蛋白质设计、生物信息学、基因组学、单细胞、智能体技能、MCP 等——按标签浏览精选资源。'
    : 'All BioAI Nav topics at a glance: drug discovery, protein design, bioinformatics, genomics, single cell, agent skills, MCP and more — browse curated resources by tag.',
})
useBreadcrumbJsonLd([
  { name: t('common.home'), path: localePath('/') },
  { name: isZh ? '标签' : 'Tags', path: localePath('/tags') },
])
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ isZh ? '标签' : 'Tags' }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ t('tags.indexTitle') }}</h1>
      <p class="page-tagline">{{ t('tags.indexSub', { n: tags.length }) }}</p>
    </header>

    <div class="page-intro prose">
      <i18n-t keypath="tags.indexIntro" tag="p" scope="global">
        <template #topic>
          <b>{{ isZh ? '药物发现' : 'drug discovery' }}</b>
        </template>
      </i18n-t>
    </div>

    <div class="link-cloud link-cloud-lg">
      <NuxtLink v-for="x in tags" :key="x.slug" :to="localePath(`/tags/${x.slug}`)" class="cloud-link">
        {{ tagLabel(x.slug, loc) }} <i>{{ x.count }}</i>
      </NuxtLink>
    </div>
  </div>
</template>
