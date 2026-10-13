<template>
  <img v-if="picture" :src="picture" alt="" class="rounded-lg object-cover" loading="lazy">
  <div v-else class="grid place-items-center rounded-lg bg-gradient-to-br text-white" :class="subject.cover">
    <i :class="subject.icon" class="text-5xl opacity-90" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { getSubject, parseGroup } from '~/data/subjects'

const props = defineProps<{ group: string | null; picture?: string | null }>()
const subject = computed(() => getSubject(parseGroup(props.group).subject))
</script>
