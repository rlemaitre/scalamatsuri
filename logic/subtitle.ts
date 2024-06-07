// import md5 from 'blueimp-md5'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { ResolvedSubtitlesConfig } from '../types'

export const isFirstTime = ref(true)
export const isPlay = ref(true)
export const currentTTSLang = useStorage<string>('slidev-tts-lang', 'en')
export const ccDisplay = useStorage<number>('slidev-cc-display', 1)
export const subtitlesConfig = ref<ResolvedSubtitlesConfig | undefined>()
export const existSubtitle = ref(true)
// export const ccDisplay = ref(1)

