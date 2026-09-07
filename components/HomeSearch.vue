<script setup lang="ts">
const q = ref('')
const router = useRouter()

const suggestions = ['AlphaFold', 'drug discovery', 'agent skills', 'single cell', 'awesome lists']

function go() {
  const t = q.value.trim()
  router.push({ path: '/search', query: t ? { q: t } : {} })
}
</script>

<template>
  <div class="home-search-wrap">
    <form class="home-search" role="search" @submit.prevent="go">
      <svg class="hs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </svg>
      <input
        v-model="q"
        type="search"
        placeholder="Search BioAI resources — tools, agents, skills, models, datasets…"
        aria-label="Search BioAI resources"
      />
      <button class="btn btn-primary" type="submit">Search</button>
    </form>
    <p class="hs-suggest">
      <span>Try:</span>
      <NuxtLink v-for="s in suggestions" :key="s" :to="`/search?q=${encodeURIComponent(s)}`">{{ s }}</NuxtLink>
    </p>
  </div>
</template>
