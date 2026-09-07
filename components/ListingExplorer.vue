<script setup lang="ts">
import type { Resource } from '~/data/load'
import { typeLabel } from '~/composables/seo'

interface SubOption {
  slug: string
  label: string
  count: number
}

const props = withDefaults(
  defineProps<{
    resources: Resource[]
    subcategories?: SubOption[]
    showCategory?: boolean
    initialQuery?: string
    hideSubFilter?: boolean
  }>(),
  { showCategory: false },
)

const { t, locale } = useI18n()
const loc = computed(() => locale.value as 'en' | 'zh')

const query = ref(props.initialQuery || '')
const activeSub = ref<string | null>(null)
const traits = reactive({ openSource: false, agent: false, mcp: false, openclaw: false, github: false })
const sort = ref<'curated' | 'name' | 'new' | 'stars'>('curated')

function haystack(r: Resource): string {
  return [
    r.name,
    r.description,
    r.category,
    r.subcategory || '',
    r.publisher || '',
    r.github || '',
    r.url,
    (r.tags || []).join(' '),
    typeLabel(r.type, 'en'),
  ]
    .join(' ')
    .toLowerCase()
}

const filtered = computed<Resource[]>(() => {
  let list = props.resources
  if (activeSub.value) list = list.filter((r) => r.subcategory === activeSub.value)
  if (traits.openSource) list = list.filter((r) => r.openSource)
  if (traits.agent) list = list.filter((r) => r.agentSupport)
  if (traits.mcp) list = list.filter((r) => r.mcp)
  if (traits.openclaw) list = list.filter((r) => r.openclaw)
  if (traits.github) list = list.filter((r) => !!r.github)

  const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length) list = list.filter((r) => terms.every((term) => haystack(r).includes(term)))

  switch (sort.value) {
    case 'name':
      return [...list].sort((a, b) => a.name.localeCompare(b.name))
    case 'new':
      return [...list].sort(
        (a, b) => (b.addedAt || '').localeCompare(a.addedAt || '') || a.name.localeCompare(b.name),
      )
    case 'stars':
      return [...list].sort((a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name))
    default:
      return list
  }
})

const hasFilter = computed(
  () =>
    !!query.value.trim() ||
    !!activeSub.value ||
    traits.openSource ||
    traits.agent ||
    traits.mcp ||
    traits.openclaw ||
    traits.github,
)

function reset() {
  query.value = ''
  activeSub.value = null
  traits.openSource = traits.agent = traits.mcp = traits.openclaw = traits.github = false
  sort.value = 'curated'
}
</script>

<template>
  <div class="explorer">
    <div class="explorer-bar">
      <div class="explorer-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <input
          v-model="query"
          type="search"
          :placeholder="t('explorer.searchPlaceholder')"
          aria-label="Search resources in this list"
        />
      </div>
      <select v-model="sort" class="explorer-sort" :aria-label="t('explorer.sort')">
        <option value="curated">{{ t('explorer.sort.curated') }}</option>
        <option value="name">{{ t('explorer.sort.name') }}</option>
        <option value="new">{{ t('explorer.sort.new') }}</option>
        <option value="stars">{{ t('explorer.sort.stars') }}</option>
      </select>
    </div>

    <div class="explorer-filters">
      <div v-if="subcategories && subcategories.length > 1 && !hideSubFilter" class="chip-row" role="group" :aria-label="t('explorer.filterSub')">
        <button class="chip" :class="{ on: !activeSub }" @click="activeSub = null">
          {{ t('explorer.all') }} <i>{{ resources.length }}</i>
        </button>
        <button
          v-for="s in subcategories"
          :key="s.slug"
          class="chip"
          :class="{ on: activeSub === s.slug }"
          @click="activeSub = activeSub === s.slug ? null : s.slug"
        >
          {{ s.label }} <i>{{ s.count }}</i>
        </button>
      </div>
      <div class="chip-row" role="group" :aria-label="t('explorer.filterTraits')">
        <button class="chip chip-toggle" :class="{ on: traits.openSource }" @click="traits.openSource = !traits.openSource">{{ t('explorer.oss') }}</button>
        <button class="chip chip-toggle" :class="{ on: traits.agent }" @click="traits.agent = !traits.agent">{{ t('explorer.agent') }}</button>
        <button class="chip chip-toggle" :class="{ on: traits.mcp }" @click="traits.mcp = !traits.mcp">{{ t('explorer.mcp') }}</button>
        <button class="chip chip-toggle" :class="{ on: traits.openclaw }" @click="traits.openclaw = !traits.openclaw">{{ t('explorer.openclaw') }}</button>
        <button class="chip chip-toggle" :class="{ on: traits.github }" @click="traits.github = !traits.github">{{ t('explorer.github') }}</button>
      </div>
    </div>

    <p class="explorer-count">
      {{ t('explorer.showing', { shown: filtered.length, total: resources.length }) }}
      <button v-if="hasFilter" class="reset-link" type="button" @click="reset">{{ t('explorer.reset') }}</button>
    </p>

    <div class="cards">
      <ResourceCard v-for="r in filtered" :key="r.category + '/' + r.slug" :resource="r" :show-category="showCategory" />
    </div>

    <div v-if="!filtered.length" class="empty-state">
      <p>{{ t('explorer.empty') }}</p>
      <button class="btn btn-ghost" type="button" @click="reset">{{ t('explorer.clear') }}</button>
    </div>
  </div>
</template>
