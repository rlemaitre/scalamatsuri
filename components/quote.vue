<template>
  <figure class="cornered">
    <blockquote :cite="url">
      <slot/>
    </blockquote>
    <figcaption v-if="author || work">
      &mdash; <span v-if="author">{{ author }}<span v-if="work">, </span></span><cite v-if="work">{{ work }}</cite>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  author?: string | null;
  work?: string | null;
  url?: string | null;
}>();
</script>

<style scoped>
.cornered blockquote {
    background-color: transparent;
    border: none;
  padding: 0;

  }
.cornered figcaption {
    margin-top: 0.5em;
    font-size: 0.8em;
    text-align: right;
  }
</style>