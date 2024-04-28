<template>
  <div class="grid grid-cols-6 w-full h-full">
    <div class="flex flex-col"></div>
    <div class="slidev-layout company col-span-4 flex flex-col text-center space-y-4 items-center w-full h-full">
      <div class="flex-col w-full flex items-center">
        <slot name="logo"><img :src="logo" width="250" class="" :alt="name"></slot>
      </div>
      <div class="flex-col w-full mb-auto">
        <slot />
      </div>
      <div v-if="tags != null && tags.length > 0" class="flex-col w-full h-full">
        <div class="tags h-full bottom-0">
          <span class="uppercase tag mx-2" v-for="item in tags"><span class="accent">#</span>{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col"></div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

export interface Blog {
  name: string
  url: string
}

type Props = {
  logo?: string;
  name?: string;
  tags?: string | string[];
  website?: Blog | null;
};
const {logo, name, tags: tagsTransferred, website} = withDefaults(defineProps<Props>(), {});

const tags = computed(() => transformIntoArray(tagsTransferred));

const transformIntoArray = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};
</script>