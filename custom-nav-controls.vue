<script setup lang="ts">
import VerticalDividerVue from '@slidev/client/internals/VerticalDivider.vue'
import SubtitleControls from './components/SubtitleControls.vue'
import { existSubtitle } from './logic/subtitle'
</script>
<template>
  <VerticalDividerVue v-if="existSubtitle" />
  <SubtitleControls v-if="existSubtitle" />
</template>
