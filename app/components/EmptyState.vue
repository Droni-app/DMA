<template>
  <div class="rounded-2xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-zinc-700">
    <i :class="icon" class="text-4xl text-zinc-400" aria-hidden="true" />
    <p class="mt-4 font-semibold text-zinc-900 dark:text-white">{{ title }}</p>
    <p v-if="text" class="mt-1 text-zinc-600 dark:text-zinc-400">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; text?: string; icon?: string }>(), { icon: 'mdi mdi-tray-remove' })
</script>
