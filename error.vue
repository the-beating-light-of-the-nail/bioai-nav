<script setup lang="ts">
import { SITE } from '~/data/categories'

const props = defineProps<{ error: { statusCode?: number; message?: string } }>()
const code = props.error?.statusCode || 404

const copy =
  code === 404
    ? 'This page doesn\u2019t exist — the resource may have been renamed or retired.'
    : props.error?.message || 'Something went wrong.'

useHead({ title: code === 404 ? 'Page Not Found | BioAI Nav' : `Error ${code} | BioAI Nav` })
useSeoMeta({ robots: 'noindex' })
</script>

<template>
  <div class="site">
    <SiteHeader />
    <main class="site-main error-page">
      <div class="container">
        <p class="error-code">{{ code }}</p>
        <h1 class="error-title">{{ code === 404 ? 'Page not found' : 'Something went wrong' }}</h1>
        <p class="error-copy">{{ copy }}</p>
        <div class="error-actions">
          <NuxtLink class="btn btn-primary" to="/">Back to home</NuxtLink>
          <NuxtLink class="btn btn-ghost" to="/search">Search resources</NuxtLink>
        </div>
        <p class="error-hint">{{ SITE.tagline }}</p>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
