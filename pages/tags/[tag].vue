<script setup lang="ts">
import { byTag, validTags } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd, useJsonLd, collectionJsonLd, tagLabel, TAG_SEO } from '~/composables/seo'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

const tagParam = (route.params.tag as string).toLowerCase()

const entry = validTags().find((x) => x.slug === tagParam)
if (!entry) {
  throw createError({ statusCode: 404, statusMessage: 'Tag not found', fatal: true })
}

const list = byTag(tagParam)
const label = tagLabel(tagParam, 'en') // 英文标签名（schema.org 与跨语言标识）
const labelLoc = tagLabel(tagParam, loc.value)
const otherTags = validTags()
  .filter((x) => x.slug !== tagParam)
  .slice(0, 12)

const isZh = loc.value === 'zh'
// 高价值标签（drug-discovery / bioinformatics / protein-design 等）用关键词专属标题，其余回落通用模板
const tagSeo = TAG_SEO[tagParam]
usePageSeo({
  title: tagSeo
    ? isZh
      ? tagSeo.titleZh
      : tagSeo.title
    : isZh
      ? `${tagLabel(tagParam, 'zh')}——BioAI 资源与工具导航 | BioAI Nav`
      : `${label} — BioAI Resources, Tools & Agents | BioAI Nav`,
  description: tagSeo
    ? isZh
      ? `BioAI 生态中的 ${entry.count} 条${tagSeo.phraseZh}——链接已核实，附开源状态与智能体友好度。`
      : `${entry.count} curated ${tagSeo.phrase} — verified links, open-source status and agent-readiness.`
    : isZh
      ? `BioAI 生态中的 ${entry.count} 条「${tagLabel(tagParam, 'zh')}」精选资源：工具、智能体、数据集、技能与学习材料——链接已核实，附开源状态与智能体友好度。`
      : `${entry.count} curated resources tagged “${label}” in the BioAI ecosystem: tools, agents, datasets, skills and learning materials — verified links, open-source status and agent-readiness.`,
})
useBreadcrumbJsonLd([
  { name: t('common.home'), path: localePath('/') },
  { name: isZh ? '标签' : 'Tags', path: localePath('/tags') },
  { name: labelLoc, path: localePath(`/tags/${tagParam}`) },
])
useJsonLd(
  collectionJsonLd({
    name: `${label} — BioAI resources`,
    description: `${entry.count} curated ${label.toLowerCase()} resources for AI in biology and biotech.`,
    path: localePath(`/tags/${tagParam}`),
    resources: list,
  }),
)
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="localePath('/tags')">{{ isZh ? '标签' : 'Tags' }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ labelLoc }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ labelLoc }}</h1>
      <p class="page-tagline">{{ t('tags.pageSub', { n: entry.count }) }}</p>
    </header>

    <div class="page-intro prose">
      <i18n-t keypath="tags.pageIntro" tag="p" scope="global">
        <template #tag>
          <b>{{ labelLoc }}</b>
        </template>
      </i18n-t>
    </div>

    <ListingExplorer :resources="list" show-category />

    <section class="link-cloud-block">
      <h2 class="cloud-title">{{ t('cloud.relatedTags') }}</h2>
      <div class="link-cloud">
        <NuxtLink v-for="x in otherTags" :key="x.slug" :to="localePath(`/tags/${x.slug}`)" class="cloud-link">
          {{ tagLabel(x.slug, loc) }} <i>{{ x.count }}</i>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
