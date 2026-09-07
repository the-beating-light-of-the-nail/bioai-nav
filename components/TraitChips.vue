<script setup lang="ts">
import type { Resource } from '~/data/load'

const { t } = useI18n()
defineProps<{ resource: Resource }>()
</script>

<template>
  <div class="traits">
    <span v-if="resource.openSource" class="trait trait-oss">{{ t('trait.oss') }}</span>
    <span v-if="resource.agentSupport" class="trait trait-agent">{{ t('trait.agent') }}</span>
    <span v-if="resource.mcp" class="trait trait-mcp">{{ t('trait.mcp') }}</span>
    <span v-if="resource.openclaw" class="trait trait-oc">{{ t('trait.openclaw') }}</span>
  </div>
</template>
