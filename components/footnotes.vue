<template>
  <div
      class="absolute bottom-0 left-0 w-full flex items-center justify-center p-2"
      v-bind:class="{
      'bg-main': filled,
    }"
  >
    <hr v-if="separator" />
    <ul
        class="flex flex-wrap items-center !list-none p-2"
        v-bind:class="{
        'justify-start': x === 'l',
        'justify-end': x === 'r',
      }"
    >
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  filled: {
    default: false,
    type: Boolean,
  },
  separator: {
    default: false,
    type: Boolean,
  },
  justify: {
    default: 'center',
    type: String as PropType<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>,
    validator:
        (value) =>
          value === 'start' || value === 'end' || value === 'center' || value === 'between' || value === 'around' || value === 'evenly'
  },
});
</script>