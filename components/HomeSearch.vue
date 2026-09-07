<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const q = ref('')
const router = useRouter()

const suggestions = computed(() =>
  locale.value === 'zh'
    ? ['药物发现', '蛋白质设计', '智能体技能', '单细胞', '模型']
    : ['AlphaFold', 'drug discovery', 'agent skills', 'single cell', 'awesome lists'],
)

function go() {
  const term = q.value.trim()
  router.push(localePath({ path: '/search', query: term ? { q: term } : {} }))
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
        :placeholder="t('hero.placeholder')"
        aria-label="Search BioAI resources"
      />
      <button class="btn btn-primary" type="submit">{{ t('hero.searchBtn') }}</button>
    </form>
    <p class="hs-suggest">
      <span>{{ t('hero.try') }}</span>
      <NuxtLink v-for="s in suggestions" :key="s" :to="localePath({ path: '/search', query: { q: s } })">{{ s }}</NuxtLink>
    </p>
  </div>
</template>
