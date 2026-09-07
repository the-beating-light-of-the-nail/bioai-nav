<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  linkTo?: string
  linkText?: string
}>()
</script>

<template>
  <div class="section-head">
    <div>
      <p v-if="kicker" class="kicker">{{ kicker }}</p>
      <h2 class="section-title">{{ title }}</h2>
    </div>
    <NuxtLink v-if="linkTo" class="see-all" :to="linkTo">{{ linkText || 'See all' }} <span aria-hidden="true">→</span></NuxtLink>
  </div>
</template>
