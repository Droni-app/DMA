<template>
  <div>
    <PageHeader
      eyebrow="Blog"
      title="Consejos para estudiar mejor"
      description="Técnicas de estudio, guías para el Saber 11 y recursos para cada materia."
    />

    <div class="mx-auto max-w-6xl px-4 py-12">
      <div class="grid gap-6 md:grid-cols-2">
        <DuiCard v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`" size="l" class="block h-full">
          <div class="space-y-3">
            <DuiBadge :label="post.tags" variant="soft" size="sm" />
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">{{ post.name }}</h2>
            <p class="leading-7 text-zinc-600 dark:text-zinc-400">{{ post.description }}</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ post.author }} · <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time> · {{ post.readingTime }} min de lectura
            </p>
          </div>
        </DuiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { posts } from '~/data/posts'

useSeo({
  title: 'Blog: técnicas de estudio y preparación Saber 11',
  description: 'Artículos con técnicas de estudio, consejos para el Saber 11 y recursos de matemáticas, lenguaje, ciencias e inglés para bachillerato.',
})
</script>
