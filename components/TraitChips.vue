<script setup lang="ts">
import type { Resource } from '~/data/load'

defineProps<{ resource: Resource }>()
</script>

<template>
  <div class="traits">
    <span v-if="resource.openSource" class="trait trait-oss" title="Open source">Open Source</span>
    <span v-if="resource.agentSupport" class="trait trait-agent" title="Usable by / built for AI agents">Agent-ready</span>
    <span v-if="resource.mcp" class="trait trait-mcp" title="Provides an MCP server or MCP support">MCP</span>
    <span v-if="resource.openclaw" class="trait trait-oc" title="Works with OpenClaw">OpenClaw</span>
  </div>
</template>
