<script setup lang="ts">
const props = defineProps<{ name: string }>()

// 24×24 线性图标（stroke: currentColor），分类图标集中在一处维护
const ICONS: Record<string, string> = {
  directories: `
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8"/>
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8"/>
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8"/>
    <rect x="13" y="13" width="7.5" height="7.5" rx="1.8"/>`,
  skills: `
    <rect x="3" y="4.5" width="18" height="15" rx="2.2"/>
    <path d="M7 9.5l3 2.5-3 2.5"/>
    <path d="M12.5 15.2H17"/>`,
  awesome: `
    <path d="M12 3.8l2.5 5.2 5.7.8-4.2 4 1 5.7-5-2.7-5 2.7 1-5.7-4.2-4 5.7-.8L12 3.8z"/>`,
  agents: `
    <rect x="5" y="8.5" width="14" height="10.5" rx="3"/>
    <circle cx="9.5" cy="13.2" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="14.5" cy="13.2" r="1.2" fill="currentColor" stroke="none"/>
    <path d="M12 8.5V6"/>
    <circle cx="12" cy="4.6" r="1.4"/>
    <path d="M9.5 16.4h5"/>`,
  tools: `
    <path d="M10 3v6.2L4.8 17.9a2 2 0 0 0 1.7 3.1h11a2 2 0 0 0 1.7-3.1L14 9.2V3"/>
    <path d="M8.5 3h7"/>
    <path d="M7.4 14.6h9.2"/>`,
  models: `
    <circle cx="5.5" cy="12" r="2.1"/>
    <circle cx="18.5" cy="5.5" r="2.1"/>
    <circle cx="18.5" cy="18.5" r="2.1"/>
    <path d="M7.4 11l9.2-4.5M7.4 13l9.2 4.5"/>`,
  platforms: `
    <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z"/>
    <path d="M3 12.2l9 4.5 9-4.5"/>
    <path d="M3 16.6L12 21l9-4.4"/>`,
  github: `
    <path d="M9 5l-6 7 6 7"/>
    <path d="M15 5l6 7-6 7"/>`,
  datasets: `
    <ellipse cx="12" cy="5.6" rx="7.5" ry="2.7"/>
    <path d="M4.5 5.6v12.8c0 1.5 3.4 2.7 7.5 2.7s7.5-1.2 7.5-2.7V5.6"/>
    <path d="M4.5 12c0 1.5 3.4 2.7 7.5 2.7s7.5-1.2 7.5-2.7"/>`,
  learning: `
    <path d="M12 6.4C10.4 4.9 8 4.4 4.5 4.6v13.2C8 17.6 10.4 18 12 19.6c1.6-1.6 4-2 7.5-1.8V4.6C16 4.4 13.6 4.9 12 6.4z"/>
    <path d="M12 6.4v13.2"/>`,
}

const icon = computed(() => ICONS[props.name] || ICONS.directories)
</script>

<template>
  <svg
    class="cat-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="icon"
  />
</template>
