<template>
  <div class="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
    <div class="h-full rounded-full bg-slate-700 transition-all dark:bg-slate-300" :style="{ width: `${value}%` }" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number }>()
</script>
