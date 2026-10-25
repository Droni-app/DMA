<template>
  <div>
    <PageHeader
      eyebrow="Comunidad"
      title="Pregunta, responde y aprende con otros"
      description="Un espacio para resolver dudas entre estudiantes y profesores."
    >
      <DuiAction to="/comunidad/nueva" color="primary" class="mt-8">
        <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Nueva pregunta
      </DuiAction>
    </PageHeader>

    <div class="mx-auto max-w-4xl px-4 py-10">
      <form role="search" @submit.prevent="applySearch">
        <DuiInput v-model="search" type="search" placeholder="Buscar en la comunidad…" aria-label="Buscar en la comunidad" block />
      </form>

      <ul v-if="topics?.data.length" class="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        <li v-for="topic in topics.data" :key="topic.id">
          <NuxtLink :to="`/comunidad/${topic.slug}`" class="flex gap-4 py-5 hover:bg-zinc-50 sm:rounded-xl sm:px-4 dark:hover:bg-zinc-900">
            <img v-if="topic.user?.avatar" :src="topic.user.avatar" alt="" class="size-10 shrink-0 rounded-full object-cover" loading="lazy" referrerpolicy="no-referrer">
            <span v-else class="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-100 font-semibold dark:bg-zinc-800">{{ initials(topic.user?.fullName) }}</span>
            <div class="min-w-0 flex-1">
              <h2 class="font-semibold text-zinc-900 dark:text-white">{{ topic.name }}</h2>
              <p class="mt-1 line-clamp-1 text-zinc-600 dark:text-zinc-400">{{ plainText(topic.content) }}</p>
              <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{{ userName(topic.user) }} · {{ formatDate(topic.createdAt) }}</p>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <EmptyState v-else-if="q" class="mt-6" icon="mdi mdi-magnify-close" title="No encontramos preguntas" text="Prueba con otra búsqueda." />
      <EmptyState v-else class="mt-6" icon="mdi mdi-forum-outline" title="Aún no hay preguntas" text="¡Sé el primero en preguntar!" />

      <DuiPagination
        v-if="(topics?.meta.lastPage ?? 1) > 1"
        v-model="page"
        :total="topics!.meta.total"
        :per-page="topics!.meta.perPage"
        class="mt-8 justify-center"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Paginated, Topic } from '~/types/api'

useSeo({
  title: 'Comunidad de estudiantes',
  description: 'Foro de estudiantes de bachillerato: resuelve dudas de matemáticas, lenguaje, ciencias, inglés y Saber 11 con la comunidad DMA.',
})

// Búsqueda y página se resuelven en el backend
const page = ref(1)
const search = ref('')
const q = ref('')
const { data: topics } = await useApi<Paginated<Topic>>(() => {
  const query = new URLSearchParams({ per_page: '20', page: String(page.value) })
  if (q.value) query.set('q', q.value)
  return `/social/topics?${query}`
})

function applySearch() {
  page.value = 1
  q.value = search.value.trim()
}
</script>
