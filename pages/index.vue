<script setup lang="ts">
import { CATEGORIES, SITE, getCategory, catText, subcategoryLabel } from '~/data/categories'
import { categoryCounts, popularSubcategoryPages, recentResources, resources } from '~/data/load'
import { usePageSeo, useJsonLd, websiteJsonLd, tagLabel } from '~/composables/seo'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

const isZh = loc.value === 'zh'
usePageSeo({
  title: isZh ? 'BioAI Nav——AI 生物学与生物科技领域的导航中心' : 'BioAI Nav — The Navigation Hub for AI in Biology & Biotech',
  description: isZh ? SITE.zh.description : SITE.description,
})
useJsonLd(websiteJsonLd())

const counts = categoryCounts()
const featured = resources.filter((r) => r.featured).slice(0, 8)
const recent = recentResources(6)
const popular = popularSubcategoryPages(6)

function popularLabel(p: { category: string; sub: string }) {
  const meta = getCategory(p.category)
  return meta ? subcategoryLabel(meta, p.sub, loc.value) : tagLabel(p.sub, loc.value)
}
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <p class="hero-eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('hero.title') }}</h1>
      <p class="hero-sub">{{ t('hero.sub') }}</p>
      <HomeSearch />
      <p class="hero-stats">
        <b>{{ t('hero.stats.res', { n: resources.length }) }}</b>
        <span aria-hidden="true">·</span>
        <b>{{ t('hero.stats.cats', { n: CATEGORIES.length }) }}</b>
        <span aria-hidden="true">·</span>
        <b>{{ t('hero.stats.repos', { n: counts.github }) }}</b>
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading :kicker="t('home.explore.kicker')" :title="t('home.explore.title')" />
      <div class="cat-grid">
        <NuxtLink v-for="c in CATEGORIES" :key="c.slug" :to="localePath(`/${c.slug}`)" class="cat-card">
          <span class="cat-icon-wrap"><CategoryIcon :name="c.slug" /></span>
          <span class="cat-card-title">{{ catText(c, loc).title }}</span>
          <span class="cat-card-count">{{ t('common.resources', { n: counts[c.slug] }) }}</span>
          <span class="cat-card-blurb">{{ catText(c, loc).blurb }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section v-if="featured.length" class="section section-alt">
    <div class="container">
      <SectionHeading :kicker="t('home.featured.kicker')" :title="t('home.featured.title')" :link-to="localePath('/tools')" :link-text="t('home.featured.link')" />
      <div class="cards">
        <ResourceCard v-for="r in featured" :key="r.category + '/' + r.slug" :resource="r" show-category />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading :kicker="t('home.recent.kicker')" :title="t('home.recent.title')" :link-to="localePath('/tags')" :link-text="t('home.recent.link')" />
      <div class="cards">
        <ResourceCard v-for="r in recent" :key="'recent-' + r.slug" :resource="r" show-category />
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <SectionHeading :kicker="t('home.popular.kicker')" :title="t('home.popular.title')" />
      <div class="popular-grid">
        <NuxtLink v-for="p in popular" :key="p.category + '/' + p.sub" :to="localePath(`/${p.category}/${p.sub}`)" class="popular-card">
          <span class="popular-label">{{ popularLabel(p) }}</span>
          <span class="popular-count">{{ t('common.resources', { n: p.count }) }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading :kicker="t('home.why.kicker')" :title="t('home.why.title')" />
      <div class="why-grid">
        <div class="why-card">
          <h3>{{ t('home.why.1.title') }}</h3>
          <p>{{ t('home.why.1.text') }}</p>
        </div>
        <div class="why-card">
          <h3>{{ t('home.why.2.title') }}</h3>
          <p>{{ t('home.why.2.text') }}</p>
        </div>
        <div class="why-card">
          <h3>{{ t('home.why.3.title') }}</h3>
          <p>{{ t('home.why.3.text') }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container cta-strip">
      <div>
        <h2 class="cta-title">{{ t('home.cta.title') }}</h2>
        <p class="cta-sub">{{ t('home.cta.sub') }}</p>
      </div>
      <div class="cta-actions">
        <NuxtLink class="btn btn-primary" :to="localePath('/submit')">{{ t('home.cta.submit') }}</NuxtLink>
        <NuxtLink class="btn btn-ghost" :to="localePath('/about')">{{ t('home.cta.about') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>
