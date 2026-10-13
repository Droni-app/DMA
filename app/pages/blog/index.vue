<template>
  <div>
    <PageHeader
      eyebrow="Blog"
      title="Consejos para estudiar mejor"
      description="Técnicas de estudio, guías para el Saber 11 y recursos para cada materia."
    />

    <div class="mx-auto max-w-6xl px-4 py-12">
      <div v-if="posts?.data.length" class="grid gap-6 md:grid-cols-2">
        <DuiCard v-for="post in posts.data" :key="post.id" :to="`/blog/${post.slug}`" size="l" class="block h-full">
          <div class="space-y-3">
            <img v-if="post.picture" :src="post.picture" alt="" class="h-48 w-full rounded-lg object-cover" loading="lazy">
            <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
              <DuiBadge v-for="tag in post.tags" :key="tag" :label="tag" variant="soft" size="sm" />
            </div>
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">{{ post.name }}</h2>
            <p class="leading-7 text-zinc-600 dark:text-zinc-400">{{ post.description }}</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              {{ post.user?.fullName }} · <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time> · {{ readingTime(post.content) }} min de lectura
            </p>
          </div>
        </DuiCard>
      </div>
      <EmptyState v-else icon="mdi mdi-post-outline" title="Aún no hay artículos" text="Muy pronto publicaremos consejos y guías de estudio." />

      <DuiPagination
        v-if="(posts?.meta.lastPage ?? 1) > 1"
        v-model="page"
        :total="posts!.meta.total"
        :per-page="posts!.meta.perPage"
        class="mt-10 justify-center"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Paginated, Post } from '~/types/api'

useSeo({
  title: 'Blog: técnicas de estudio y preparación Saber 11',
  description: 'Artículos con técnicas de estudio, consejos para el Saber 11 y recursos de matemáticas, lenguaje, ciencias e inglés para bachillerato.',
})

const page = ref(1)
const { data: posts } = await useApi<Paginated<Post>>(() => `/content/posts?page=${page.value}`)
</script>
