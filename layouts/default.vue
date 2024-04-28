<template>
  <div class="grid grid-cols-8 h-full">
    <div class="flex flex-col"></div>
    <div class="slidev-layout default flex col-span-6">
      <div class="w-full h-full flex flex-col justify-center items-stretch text-center">
        <slot/>
      </div>
    </div>
    <div class="flex flex-col"></div>
  </div>
</template>
