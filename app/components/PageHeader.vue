<template>
  <div class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p v-if="eyebrow" class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ eyebrow }}</p>
      <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{{ title }}</h1>
      <p v-if="description" class="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string; eyebrow?: string }>()
</script>
