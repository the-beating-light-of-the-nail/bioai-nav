<script setup lang="ts">
import { CATEGORIES, SITE, getCategory } from '~/data/categories'
import { categoryCounts, popularSubcategoryPages, recentResources, resources } from '~/data/load'
import { usePageSeo, useJsonLd, websiteJsonLd, tagLabel } from '~/composables/seo'

usePageSeo({
  title: 'BioAI Nav — The Navigation Hub for AI in Biology & Biotech',
  description: SITE.description,
  path: '/',
})
useJsonLd(websiteJsonLd())

const counts = categoryCounts()
const featured = resources.filter((r) => r.featured).slice(0, 8)
const recent = recentResources(6)
const popular = popularSubcategoryPages(6)

function popularLabel(p: { category: string; sub: string }) {
  const meta = getCategory(p.category)
  const sub = meta?.subcategories?.find((s) => s.slug === p.sub)
  return sub?.label || tagLabel(p.sub)
}
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <p class="hero-eyebrow">BioAI Nav</p>
      <h1 class="hero-title">The Navigation Hub for AI in Biology &amp; Biotech</h1>
      <p class="hero-sub">
        Discover AI tools, agents, skills, awesome lists, models, platforms, GitHub projects, datasets and learning
        resources across the BioAI ecosystem — find where to look, not just what to use.
      </p>
      <HomeSearch />
      <p class="hero-stats">
        <b>{{ resources.length }}</b> curated resources
        <span aria-hidden="true">·</span>
        <b>{{ CATEGORIES.length }}</b> categories
        <span aria-hidden="true">·</span>
        <b>{{ counts.github }}</b> open-source repos
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading kicker="Explore BioAI" title="Ten ways into the ecosystem" />
      <div class="cat-grid">
        <NuxtLink v-for="c in CATEGORIES" :key="c.slug" :to="`/${c.slug}`" class="cat-card">
          <span class="cat-icon-wrap"><CategoryIcon :name="c.slug" /></span>
          <span class="cat-card-title">{{ c.title }}</span>
          <span class="cat-card-count">{{ counts[c.slug] }} resources</span>
          <span class="cat-card-blurb">{{ c.blurb }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section v-if="featured.length" class="section section-alt">
    <div class="container">
      <SectionHeading kicker="Featured" title="Featured resources" link-to="/tools" link-text="Browse all tools" />
      <div class="cards">
        <ResourceCard v-for="r in featured" :key="r.category + '/' + r.slug" :resource="r" show-category />
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading kicker="Fresh" title="Recently added" link-to="/tags" link-text="Browse by tag" />
      <div class="cards cards-compact">
        <ResourceCard v-for="r in recent" :key="'recent-' + r.slug" :resource="r" show-category />
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <SectionHeading kicker="Popular" title="Popular categories" />
      <div class="popular-grid">
        <NuxtLink v-for="p in popular" :key="p.category + '/' + p.sub" :to="`/${p.category}/${p.sub}`" class="popular-card">
          <span class="popular-label">{{ popularLabel(p) }}</span>
          <span class="popular-count">{{ p.count }} curated resources</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading kicker="Why" title="Why BioAI Nav?" />
      <div class="why-grid">
        <div class="why-card">
          <h3>One map of a fragmented ecosystem</h3>
          <p>
            BioAI resources are fragmented across directories, GitHub repositories, skill libraries and research
            platforms. BioAI Nav brings them together in one place — a navigation of navigations.
          </p>
        </div>
        <div class="why-card">
          <h3>Curated, not scraped</h3>
          <p>
            Every entry is verified by a human: a real project, a working link, honest metadata. We prefer 100
            high-quality resources over 2,000 unverified links.
          </p>
        </div>
        <div class="why-card">
          <h3>Built for the agent era</h3>
          <p>
            We flag MCP servers, agent skills and OpenClaw compatibility on every resource, so your AI agents can use
            this map too — not just you.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container cta-strip">
      <div>
        <h2 class="cta-title">Know a resource we&rsquo;re missing?</h2>
        <p class="cta-sub">Submissions are reviewed by a human, usually within a week.</p>
      </div>
      <div class="cta-actions">
        <NuxtLink class="btn btn-primary" to="/submit">Submit a resource</NuxtLink>
        <NuxtLink class="btn btn-ghost" to="/about">About BioAI Nav</NuxtLink>
      </div>
    </div>
  </section>
</template>
