<script setup lang="ts">

import {computed} from 'vue'
import {resolveAssetUrl} from '../helpers'

export interface Blog {
  name: string
  url: string
}

export interface Props {
  speaker: string
  twitter: string | null
  bluesky: string | null
  image: string
  tags: Array<string>
  job?: string
  company?: string
  website?: Blog | null
  mail?: string
  blog?: Blog | null
}

const props = withDefaults(defineProps<Props>(), {
  twitter: null,
  bluesky: null,
  job: '',
  company: '',
  mail: '',
  blog: null,
  tags: new Array<string>()
})
const imageSrc = resolveAssetUrl(props.image);
</script>

<template>
  <div class="grid grid-cols-6">
    <div class="flex flex-col"></div>
    <div class="slidev-layout profile col-span-4 flex flex-col text-center space-y-4">
      <div class="w-full flex flex-col items-center">
        <h1>{{ speaker }}</h1>
      </div>

      <div class="w-full flex flex-col items-center">
        <img :src="imageSrc" width="200" class="rounded-full image-render-edge" :alt="speaker">
      </div>

      <div class="flex-col w-full">{{ job }} <span class="accent">@</span> {{ company }}</div>
      <div v-if="tags != null && tags.length > 0" class="flex-col w-full">
        <div class="tags h-full bottom-0">
          <span class="uppercase tag mx-2" v-for="item in tags"><span class="accent">#</span>{{ item }}</span>
        </div>
      </div>
      <div class="contact flex-col w-full">
        <h3 class="uppercase">Contact</h3>
        <div>
          <a class="mx-2" v-if="blog" v-bind:href="blog.url" target="_blank">
            <material-symbols-light-home-outline-rounded class="text-red-600"/>
            {{ blog.name }}
          </a>
          <a class="mx-2" v-if="website" v-bind:href="website.url" target="_blank">
            <material-symbols-light-business-center-outline-rounded class="text-red-600"/>
            {{ website.name }}
          </a>
        </div>
        <div>
          <a class="mx-2" v-bind:href="'mailto:' + mail">
            <material-symbols-light-alternate-email class="text-red-600"/>
            {{ mail }}
          </a>
          <a class="mx-2" v-if="twitter" v-bind:href="'https://twitter.com/' + twitter" target="_blank">
            <arcticons-x-twitter class="text-red-600"/> 
            {{ twitter }}
          </a>
          <a class="mx-2" v-bind:href="'https://bsky.app/' + bluesky" target="_blank">
            <arcticons-bluesky class="text-red-600"/> 
            {{ bluesky }}
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-col"></div>

  </div>
</template>
