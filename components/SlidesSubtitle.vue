<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import type { Subtitles } from '../types'
import { currentTTSLang, existSubtitle, isFirstTime, subtitlesConfig } from '../logic/subtitle'
// import { downloadTTS } from '../utils'
const nav = useNav()
const props = defineProps<{ subtitles: Subtitles }>()
const contents = ref(props.subtitles.contents)
const config = ref(props.subtitles.config)
const {
  background,
  color,
  noTTSDelay,
  fontSize,
} = config.value

const subtitleIdx = ref(-1)
const subtitleCount = ref(0)
const subtitleDisplay = ref(false)
const curSubtitle = ref('')
const language = computed(() => currentTTSLang.value)
const page = computed(() => `page${nav.currentPage.value}`)
const click = computed(() => `click${nav.clicks.value}`)
const lines = computed(() => curSubtitle.split('\n'))

const parseSubtitle = () => {
  const arr = contents.value[language.value][page.value][click.value][subtitleIdx.value].split('/D/')
  curSubtitle.value = arr[0].trim()
}

const initSubtitle = () => {
  subtitleIdx.value = -1
  if (contents.value
    && contents.value[language.value][page.value]
    && contents.value[language.value][page.value][click.value]
  ) {
    subtitleCount.value = contents.value[language.value][page.value][click.value].length
    if (subtitleCount.value > 0) {
      subtitleIdx.value = 0
      parseSubtitle()
      return
    }
  }
}

const resetSubtitle = () => {
  if (contents.value
    && contents.value[language.value][page.value]
    && contents.value[language.value][page.value][click.value]
  ) {
    console.error(`${language.value} / ${page.value} / ${click.value}`)
    subtitleCount.value = contents.value[language.value][page.value][click.value].length
    if (subtitleCount.value > 0) {
      if (subtitleIdx.value < 0)
        subtitleIdx.value = 0
      if (contents.value[language.value][page.value][click.value][subtitleIdx.value]) {
        parseSubtitle()
        return
      }
    }
  }
}

const play = () => {
}

const pause = () => {
}

watch([nav.clicks, nav.currentPage], () => {
  initSubtitle()
})
watch([curSubtitle, subtitleIdx], () => {
  if (!isFirstTime.value && subtitleIdx.value !== -1)
    play()
})
//watch(isPlay, () => {
//  if (isPlay.value)
//    play()
//  else
//    pause()
//})
watch([currentTTSLang], () => {
  resetSubtitle()
})
onMounted(async() => {
  // await downloadTTS(props.subtitles)
  existSubtitle.value = true
  subtitlesConfig.value = config.value
  initSubtitle()
})
</script>

<template>
  <div v-if="contents && contents[language] && contents[language][page] && contents[language][page][click]">
    <span v-if="curSubtitle" class="subtitle" :style="{background, color, fontSize}">{{ curSubtitle }}</span>
  </div>
</template>
