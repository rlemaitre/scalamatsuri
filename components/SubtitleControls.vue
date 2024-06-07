<script setup lang="ts">
import MenuButton from '@slidev/client/internals/MenuButton.vue'
import { ccDisplay, subtitlesConfig } from '../logic/subtitle'
import LanguageList from './LanguageList.vue'

console.info('config', subtitlesConfig)

</script>

<template>
  <MenuButton>
    <template #button>
      <button class="icon-btn" title="Subtitles">
        <ic-outline-subtitles v-if="ccDisplay" />
        <ic-outline-subtitles-off v-else />
      </button>
    </template>
    <template #menu>
      <LanguageList :config="subtitlesConfig!" />
    </template>
  </MenuButton>
</template>
