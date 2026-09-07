<script setup lang="ts">
import { CATEGORIES, SITE } from '~/data/categories'
import { popularSubcategoryPages, categoryCounts, resources } from '~/data/load'
import { tagLabel } from '~/composables/seo'

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
        <p class="footer-tagline">{{ SITE.tagline }}</p>
        <p class="footer-note">
          {{ total }} curated resources across {{ CATEGORIES.length }} categories. Not another tools directory — the
          discovery layer of the BioAI ecosystem.
        </p>
      </div>

      <nav class="footer-col" aria-label="Categories">
        <h3>Categories</h3>
        <NuxtLink v-for="c in CATEGORIES" :key="c.slug" :to="`/${c.slug}`">{{ c.title }}</NuxtLink>
      </nav>

      <nav class="footer-col" aria-label="Popular sections">
        <h3>Popular</h3>
        <NuxtLink
          v-for="p in popular"
          :key="p.category + '/' + p.sub"
          :to="`/${p.category}/${p.sub}`"
        >
          {{ tagLabel(p.sub) }}
          <small>{{ counts[p.category] ? '' : '' }}</small>
        </NuxtLink>
      </nav>

      <nav class="footer-col" aria-label="Site">
        <h3>Site</h3>
        <NuxtLink to="/search">Search</NuxtLink>
        <NuxtLink to="/tags">Browse by tag</NuxtLink>
        <NuxtLink to="/submit">Submit a resource</NuxtLink>
        <NuxtLink to="/about">About &amp; editorial standards</NuxtLink>
        <a :href="SITE.url + '/sitemap.xml'">Sitemap</a>
        <a :href="'https://github.com/' + SITE.githubRepo" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>© {{ year }} BioAI Nav · Discover the BioAI ecosystem.</span>
        <span>Curated by humans, for humans — and their agents.</span>
      </div>
    </div>
  </footer>
</template>
