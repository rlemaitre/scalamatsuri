<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SelectList from '@slidev/client/internals/SelectList.vue'
import type { SelectionItem } from '@slidev/client/internals/types'
import { currentTTSLang } from '../logic/subtitle'
import type { ResolvedSubtitlesConfig } from './types'

const props = defineProps<{ config: ResolvedSubtitlesConfig }>()
const getLangName = (str: string) => {
  return props.config.ttsLangName[str] || str
}

const languagesItems = computed<SelectionItem<string>[]>(() => [
  ...props.config.ttsLanguages.map(v => ({
    value: v,
    display: getLangName(v),
  })),
])
onMounted(() => {
  if (!props.config.ttsLanguages.find(i => i === currentTTSLang.value)) {
    if (props.config.ttsLanguages[0])
      currentTTSLang.value = props.config.ttsLanguages[0]
  }
})
</script>

<template>
  <div class="text-sm">
    <SelectList v-model="currentTTSLang" title="Language" :items="languagesItems" />
  </div>
</template>
