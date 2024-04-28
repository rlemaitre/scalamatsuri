/* ./setup/shiki.ts */
import { defineShikiSetup } from '@slidev/types'
import customTheme from './material-theme-darker.json'

export default defineShikiSetup(() => {
  return {
    theme: customTheme
  }
})
