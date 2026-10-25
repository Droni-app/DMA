<template>
  <div>
    <PageHeader
      eyebrow="Blog"
      title="Consejos para estudiar mejor"
      description="Técnicas de estudio, guías para el Saber 11 y recursos para cada materia."
    />

    <div class="mx-auto max-w-6xl px-4 py-12">
      <form class="mb-8 flex flex-wrap items-center gap-3" role="search" @submit.prevent="applySearch">
        <DuiInput v-model="search" type="search" placeholder="Buscar artículos…" aria-label="Buscar artículos" class="min-w-0 flex-1" block />
        <DuiBadge v-if="tag" :label="`#${tag} ✕`" variant="soft" class="cursor-pointer" @click="navigateTo({ query: {} })" />
      </form>

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
      <EmptyState v-else-if="q || tag" icon="mdi mdi-magnify-close" title="No encontramos artículos" text="Prueba con otra búsqueda." />
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

const route = useRoute()
const page = ref(1)
const search = ref('')
const q = ref('')
const tag = computed(() => String(route.query.tag ?? ''))
watch(tag, () => (page.value = 1))
const { data: posts } = await useApi<Paginated<Post>>(() => {
  const query = new URLSearchParams({ per_page: '10', page: String(page.value) })
  if (q.value) query.set('q', q.value)
  if (tag.value) query.set('tags', tag.value)
  return `/content/posts?${query}`
})

function applySearch() {
  page.value = 1
  q.value = search.value.trim()
}
</script>
