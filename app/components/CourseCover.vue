<template>
  <div class="grid place-items-center rounded-lg bg-gradient-to-br text-white" :class="subject.cover">
    <i :class="subject.icon" class="text-5xl opacity-90" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { getSubject } from '~/data/courses'

const props = defineProps<{ subjectSlug: string }>()
const subject = computed(() => getSubject(props.subjectSlug))
</script>
