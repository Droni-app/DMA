<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Blog</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Artículos publicados y borradores.</p>
      </div>
      <DuiAction to="/panel/admin/blog/nuevo" color="primary">
        <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Nuevo artículo
      </DuiAction>
    </div>

    <form class="mt-6" role="search" @submit.prevent="applySearch">
      <DuiInput v-model="search" type="search" placeholder="Buscar artículos…" aria-label="Buscar artículos" block />
    </form>

    <ul v-if="posts?.data.length" class="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      <li v-for="post in posts.data" :key="post.id">
        <NuxtLink :to="`/panel/admin/blog/${post.id}`" class="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
          <img v-if="post.picture" :src="post.picture" alt="" class="size-12 shrink-0 rounded-lg object-cover" loading="lazy">
          <span v-else class="grid size-12 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800"><i class="mdi mdi-post-outline text-xl text-zinc-400" aria-hidden="true" /></span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-zinc-900 dark:text-white">{{ post.name }}</p>
            <p class="truncate text-sm text-zinc-500">{{ formatDate(post.createdAt) }}<template v-if="post.tags?.length"> · {{ post.tags.join(', ') }}</template></p>
          </div>
          <DuiBadge :label="isTrue(post.active) ? 'Publicado' : 'Borrador'" :color="isTrue(post.active) ? 'success' : 'warning'" variant="soft" size="sm" />
          <i class="mdi mdi-chevron-right text-xl text-zinc-400" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
    <EmptyState v-else class="mt-6" icon="mdi mdi-post-outline" title="No hay artículos" />

    <DuiPagination v-if="(posts?.meta.lastPage ?? 1) > 1" v-model="page" :total="posts!.meta.total" :per-page="posts!.meta.perPage" class="mt-8 justify-center" />
  </div>
</template>

<script setup lang="ts">
import type { Paginated, Post } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'owner' })
useSeo({ title: 'Administrar blog', description: 'Administración del blog.', noindex: true })

const page = ref(1)
const search = ref('')
const q = ref('')
const { data: posts } = await useApi<Paginated<Post>>(() => `/admin/content/posts?per_page=20&page=${page.value}&q=${encodeURIComponent(q.value)}`)

function applySearch() {
  page.value = 1
  q.value = search.value.trim()
}
</script>
