<script setup lang="ts">
import { CATEGORIES, SITE, catText } from '~/data/categories'
import { categoryCounts, resources } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd } from '~/composables/seo'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')
const isZh = loc.value === 'zh'

usePageSeo({
  title: isZh ? '关于 BioAI Nav——BioAI 生态的发现层 | BioAI Nav' : 'About BioAI Nav — The Discovery Layer of the BioAI Ecosystem',
  description: isZh
    ? 'BioAI Nav 是 AI 生物学与生物科技的导航中心：我们如何筛选资源、收录什么、编辑标准是什么。发现去哪里找 BioAI 工具、智能体、技能、模型与数据集。'
    : 'BioAI Nav is the navigation hub for AI in biology and biotech: how we curate resources, what we catalog, and our editorial standards. Discover where to find BioAI tools, agents, skills, models and datasets.',
})
useBreadcrumbJsonLd([
  { name: t('common.home'), path: localePath('/') },
  { name: isZh ? '关于' : 'About', path: localePath('/about') },
])

const counts = categoryCounts()
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ isZh ? '关于' : 'About' }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ t('about.title') }}</h1>
      <p class="page-tagline">{{ t('about.sub') }}</p>
    </header>

    <div class="page-intro prose">
      <i18n-t keypath="about.intro1" tag="p" scope="global">
        <template #q><b>{{ isZh ? '该去哪里找？' : 'where should you be looking?' }}</b></template>
      </i18n-t>
      <p>{{ t('about.intro2') }}</p>
    </div>

    <section class="detail-section prose">
      <h2>{{ t('about.whatTitle') }}</h2>
      <p>{{ t('about.whatLead') }}</p>
      <ul class="cat-list">
        <li v-for="c in CATEGORIES" :key="c.slug">
          <NuxtLink :to="localePath(`/${c.slug}`)">{{ catText(c, loc).title }}</NuxtLink> — {{ catText(c, loc).blurb }}
          <i>({{ counts[c.slug] }})</i>
        </li>
      </ul>
      <p>{{ t('about.whatTotal', { n: resources.length }) }}</p>
    </section>

    <section class="detail-section prose">
      <h2>{{ t('about.standardsTitle') }}</h2>
      <ul>
        <li>
          <i18n-t keypath="about.standards1" scope="global" tag="span">
            <template #lead><b>{{ t('about.standards1.lead') }}</b></template>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="about.standards2" scope="global" tag="span">
            <template #lead><b>{{ t('about.standards2.lead') }}</b></template>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="about.standards3" scope="global" tag="span">
            <template #lead><b>{{ t('about.standards3.lead') }}</b></template>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="about.standards4" scope="global" tag="span">
            <template #lead><b>{{ t('about.standards4.lead') }}</b></template>
          </i18n-t>
        </li>
      </ul>
    </section>

    <section class="detail-section prose">
      <h2>{{ t('about.roadmapTitle') }}</h2>
      <ul>
        <li>{{ t('about.roadmap1') }}</li>
        <li>{{ t('about.roadmap2') }}</li>
        <li>{{ t('about.roadmap3') }}</li>
        <li>{{ t('about.roadmap4') }}</li>
      </ul>
    </section>

    <section class="detail-section prose">
      <h2>{{ t('about.contactTitle') }}</h2>
      <i18n-t keypath="about.contactText" tag="p" scope="global">
        <template #link>
          <NuxtLink :to="localePath('/submit')">{{ isZh ? '投稿表单' : 'submission form' }}</NuxtLink>
        </template>
        <template #gh>
          <a :href="'https://github.com/' + SITE.githubRepo" target="_blank" rel="noopener noreferrer">GitHub</a>
        </template>
      </i18n-t>
    </section>
  </div>
</template>
