<template>
  <!-- Ocupa todo el ancho disponible sin pasarse de la altura de la pantalla -->
  <div class="bg-black">
    <div class="mx-auto aspect-video w-full max-w-[calc((100vh-3.5rem)*16/9)]">
      <iframe
        v-if="embed"
        :src="embed"
        :title="title"
        class="size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen
      />
      <div v-else class="grid size-full place-items-center bg-gradient-to-br text-white" :class="subject.cover">
        <div class="text-center">
          <i :class="subject.icon" class="text-6xl opacity-90" aria-hidden="true" />
          <p class="mt-4 px-4 text-lg font-semibold sm:text-2xl">{{ title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSubject, parseGroup } from '~/data/subjects'

const props = defineProps<{ src?: string | null; title: string; group?: string | null }>()
const embed = computed(() => embedUrl(props.src ?? null))
const subject = computed(() => getSubject(parseGroup(props.group ?? null).subject))
</script>
