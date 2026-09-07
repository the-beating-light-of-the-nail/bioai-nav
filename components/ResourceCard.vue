<script setup lang="ts">
import type { Resource } from '~/data/load'
import { resourceText, tagPageSet } from '~/data/load'
import { getCategory, catText } from '~/data/categories'
import { typeLabel, formatStars, tagLabel } from '~/composables/seo'

const props = withDefaults(defineProps<{ resource: Resource; showCategory?: boolean }>(), {
  showCategory: false,
})

const { locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')

const host = computed(() => {
  try {
    return new URL(props.resource.url).hostname.replace(/^www\./, '')
  } catch {
    return props.resource.url
  }
})
const catMeta = computed(() => getCategory(props.resource.category))
const text = computed(() => resourceText(props.resource, loc.value))
const shownTags = computed(() =>
  (props.resource.tags || []).filter((t) => tagPageSet().has(t.toLowerCase())).slice(0, 4),
)
const plainTags = computed(() =>
  shownTags.value.length ? [] : (props.resource.tags || []).slice(0, 3),
)
</script>

<template>
  <article class="rcard">
    <div class="rcard-head">
      <ResourceAvatar :name="resource.name" :size="40" />
      <div class="rcard-title">
        <h3 class="rcard-name">
          <NuxtLink :to="localePath(`/${resource.category}/${resource.slug}`)">{{ resource.name }}</NuxtLink>
        </h3>
        <div class="rcard-meta">
          <span class="type-chip">{{ typeLabel(resource.type, loc) }}</span>
          <NuxtLink v-if="showCategory && catMeta" :to="localePath(`/${catMeta.slug}`)" class="cat-chip">
            {{ catText(catMeta, loc).title }}
          </NuxtLink>
          <span v-if="formatStars(resource.stars)" class="star-chip">★ {{ formatStars(resource.stars) }}</span>
        </div>
      </div>
    </div>

    <p class="rcard-desc">{{ text.description }}</p>

    <div v-if="shownTags.length || plainTags.length" class="rcard-tags">
      <NuxtLink v-for="t in shownTags" :key="t" class="tag-chip" :to="localePath(`/tags/${t.toLowerCase()}`)">
        {{ tagLabel(t, loc) }}
      </NuxtLink>
      <span v-for="t in plainTags" :key="'p-' + t" class="tag-chip tag-chip-static">{{ tagLabel(t, loc) }}</span>
    </div>

    <div class="rcard-foot">
      <TraitChips :resource="resource" />
      <div class="rcard-links">
        <a
          v-if="resource.github"
          class="mini-link"
          :href="resource.github"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >
        <a class="mini-link visit" :href="resource.url" target="_blank" rel="noopener noreferrer">
          {{ host }} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </article>
</template>
