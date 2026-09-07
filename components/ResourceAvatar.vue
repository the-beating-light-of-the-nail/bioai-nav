<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 42 })

// 无 logo 素材依赖：按名称哈希出稳定色相的单字 monogram
const hue = computed(() => {
  let h = 0
  for (const ch of props.name) h = (h * 31 + (ch.codePointAt(0) || 0)) % 360
  return h
})
const initial = computed(() => (props.name.replace(/[^A-Za-z0-9]/g, '').charAt(0) || '?').toUpperCase())
</script>

<template>
  <span
    class="avatar"
    :style="{
      '--h': hue,
      width: size + 'px',
      height: size + 'px',
      fontSize: Math.round(size * 0.42) + 'px',
      borderRadius: Math.round(size * 0.24) + 'px',
    }"
    aria-hidden="true"
  >{{ initial }}</span>
</template>
