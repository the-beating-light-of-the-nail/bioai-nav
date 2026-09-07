<script setup lang="ts">
import { CATEGORIES, catText } from '~/data/categories'

const { locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const route = useRoute()
const open = ref(false)
const activeCat = computed(() => (route.params.category as string) || '')
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink :to="localePath('/')" class="brand" aria-label="BioAI Nav — home">
        <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M16 3l11 6.5v13L16 29 5 22.5v-13L16 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
          <circle cx="16" cy="16" r="2.6" fill="currentColor" />
          <circle cx="16" cy="7.6" r="2" fill="currentColor" />
          <circle cx="23.4" cy="20.6" r="2" fill="currentColor" />
          <circle cx="8.6" cy="20.6" r="2" fill="currentColor" />
          <path d="M16 9.6v3.8M17.9 17.8l3.7 2.1M14.1 17.8l-3.7 2.1" stroke="currentColor" stroke-width="1.4" />
        </svg>
        <span class="brand-name">BioAI<em>Nav</em></span>
      </NuxtLink>

      <nav class="main-nav" :class="{ open }" aria-label="Primary">
        <NuxtLink
          v-for="c in CATEGORIES"
          :key="c.slug"
          :to="localePath(`/${c.slug}`)"
          class="nav-link"
          :class="{ active: activeCat === c.slug }"
        >
          {{ catText(c, locale as 'en' | 'zh').title }}
        </NuxtLink>
      </nav>

      <div class="header-actions">
        <NuxtLink :to="switchLocalePath(locale === 'zh' ? 'en' : 'zh')" class="lang-switch" aria-label="Switch language">
          {{ $t('lang.switch') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/search')" class="icon-btn" :aria-label="$t('nav.search')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
        </NuxtLink>
        <NuxtLink :to="localePath('/submit')" class="btn btn-small btn-primary">{{ $t('nav.submit') }}</NuxtLink>
        <button
          class="icon-btn burger"
          :class="{ open }"
          :aria-expanded="open"
          :aria-label="$t('nav.toggle')"
          @click="open = !open"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
