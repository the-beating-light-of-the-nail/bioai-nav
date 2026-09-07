<script setup lang="ts">
import { CATEGORIES, SITE, catText, subcategoryLabel } from '~/data/categories'
import { popularSubcategoryPages, categoryCounts, resources } from '~/data/load'
import { tagLabel } from '~/composables/seo'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const counts = categoryCounts()
const popular = popularSubcategoryPages(8)
const year = new Date().getFullYear()
const total = resources.length
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <div class="brand">
          <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 3l11 6.5v13L16 29 5 22.5v-13L16 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            <circle cx="16" cy="16" r="2.6" fill="currentColor" />
            <circle cx="16" cy="7.6" r="2" fill="currentColor" />
            <circle cx="23.4" cy="20.6" r="2" fill="currentColor" />
            <circle cx="8.6" cy="20.6" r="2" fill="currentColor" />
          </svg>
          <span class="brand-name">BioAI<em>Nav</em></span>
        </div>
        <p class="footer-tagline">{{ locale === 'zh' ? SITE.zh.tagline : SITE.tagline }}</p>
        <p class="footer-note">
          {{ t('footer.aboutNote', { n: total, cats: CATEGORIES.length }) }}
        </p>
      </div>

      <nav class="footer-col" aria-label="Categories">
        <h3>{{ t('footer.categories') }}</h3>
        <NuxtLink v-for="c in CATEGORIES" :key="c.slug" :to="localePath(`/${c.slug}`)">
          {{ catText(c, locale as 'en' | 'zh').title }}
        </NuxtLink>
      </nav>

      <nav class="footer-col" aria-label="Popular sections">
        <h3>{{ t('footer.popular') }}</h3>
        <NuxtLink
          v-for="p in popular"
          :key="p.category + '/' + p.sub"
          :to="localePath(`/${p.category}/${p.sub}`)"
        >
          {{ tagLabel(p.sub, locale as 'en' | 'zh') }}
        </NuxtLink>
      </nav>

      <nav class="footer-col" aria-label="Site">
        <h3>{{ t('footer.site') }}</h3>
        <NuxtLink :to="localePath('/search')">{{ t('footer.search') }}</NuxtLink>
        <NuxtLink :to="localePath('/tags')">{{ t('footer.tags') }}</NuxtLink>
        <NuxtLink :to="localePath('/submit')">{{ t('footer.submit') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')">{{ t('footer.about') }}</NuxtLink>
        <a :href="SITE.url + '/sitemap.xml'">{{ t('footer.sitemap') }}</a>
        <a :href="'https://github.com/' + SITE.githubRepo" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>{{ t('footer.rights', { year }) }}</span>
        <span>{{ t('footer.crafted') }}</span>
      </div>
    </div>
  </footer>
</template>
