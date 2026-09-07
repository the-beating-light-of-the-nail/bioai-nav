<script setup lang="ts">
import { CATEGORIES, SITE } from '~/data/categories'
import { categoryCounts, resources } from '~/data/load'
import { usePageSeo, useBreadcrumbJsonLd } from '~/composables/seo'

usePageSeo({
  title: 'About BioAI Nav — The Discovery Layer of the BioAI Ecosystem',
  description:
    'BioAI Nav is the navigation hub for AI in biology and biotech: how we curate resources, what we catalog, and our editorial standards. Discover where to find BioAI tools, agents, skills, models and datasets.',
  path: '/about',
})
useBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
])

const counts = categoryCounts()
</script>

<template>
  <div class="container page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">About</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">The discovery layer of the BioAI ecosystem</h1>
      <p class="page-tagline">Not another tools directory</p>
    </header>

    <div class="page-intro prose">
      <p>
        BioAI resources are fragmented across directories, GitHub repositories, skill libraries, commercial platforms
        and research labs. Before you can pick a tool, an agent or a dataset, you first have to answer a harder
        question: <b>where should you be looking?</b>
      </p>
      <p>
        BioAI Nav exists to answer that question. We catalog the navigational infrastructure of AI in biology and
        biotech — the directories, awesome lists and skill registries that map the field — alongside the flagship
        tools, models, platforms, datasets and learning resources themselves. Think of it as a navigation of
        navigations.
      </p>
    </div>

    <section class="detail-section prose">
      <h2>What we catalog</h2>
      <p>Every resource on BioAI Nav belongs to one of ten categories:</p>
      <ul class="cat-list">
        <li v-for="c in CATEGORIES" :key="c.slug">
          <NuxtLink :to="`/${c.slug}`">{{ c.title }}</NuxtLink> — {{ c.blurb }}
          <i>({{ counts[c.slug] }})</i>
        </li>
      </ul>
      <p>
        In total, {{ resources.length }} curated entries and growing — deliberately. We would rather list 300
        high-quality resources than 3,000 unverified links.
      </p>
    </section>

    <section class="detail-section prose">
      <h2>Editorial standards</h2>
      <ul>
        <li><b>Real, verified, current.</b> Every entry is checked by a human before listing: a real project, a working official link, honest metadata. Dead or abandoned projects get retired.</li>
        <li><b>No paid placement.</b> Featured positions are editorial choices, not advertisements.</li>
        <li><b>Honest flags.</b> Open-source status, agent-readiness, MCP and OpenClaw support are recorded as facts, not marketing. A closed platform is listed as a closed platform.</li>
        <li><b>The ecosystem is the catalog.</b> Directories and awesome lists are not our competitors — they are our content. We link to the best of them and let you go deep where they are strong.</li>
      </ul>
    </section>

    <section class="detail-section prose">
      <h2>Roadmap</h2>
      <ul>
        <li>Periodic refresh of GitHub stars, languages and last-update metadata for cataloged repositories.</li>
        <li>More programmatic topic pages as the catalog grows past each quality threshold.</li>
        <li>A Chinese edition (中文版) once the English catalog stabilizes.</li>
        <li>Machine-readable exports — the catalog is plain JSON and stays that way.</li>
      </ul>
    </section>

    <section class="detail-section prose">
      <h2>Get in touch</h2>
      <p>
        The fastest way to reach us is the
        <NuxtLink to="/submit">submission form</NuxtLink> — it works for corrections and feedback too, not just new
        resources. The source and issue tracker live on
        <a :href="'https://github.com/' + SITE.githubRepo" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </section>
  </div>
</template>
