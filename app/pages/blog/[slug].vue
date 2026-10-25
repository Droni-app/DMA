<template>
  <article v-if="post" class="mx-auto max-w-3xl px-4 py-12 sm:py-16">
    <NuxtLink to="/blog" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver al blog</NuxtLink>
    <header class="mt-6">
      <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
        <NuxtLink v-for="tag in post.tags" :key="tag" :to="{ path: '/blog', query: { tag } }">
          <DuiBadge :label="tag" variant="soft" />
        </NuxtLink>
      </div>
      <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">{{ post.name }}</h1>
      <p v-if="post.description" class="mt-4 text-xl leading-8 text-zinc-600 dark:text-zinc-400">{{ post.description }}</p>
      <p class="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Por <strong class="text-zinc-700 dark:text-zinc-300">{{ post.user?.fullName }}</strong> ·
        <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time> · {{ readingTime(post.content) }} min de lectura
      </p>
    </header>
    <img v-if="post.picture" :src="post.picture" alt="" class="mt-10 w-full rounded-2xl object-cover" fetchpriority="high">
    <hr v-else class="my-10 border-zinc-200 dark:border-zinc-800">
    <div class="reading mt-10" v-html="renderContent(post.content, post.format)" />

    <BlogComments :post-id="post.id" class="mt-16" />

    <aside class="mt-16 rounded-2xl bg-zinc-50 p-8 text-center dark:bg-zinc-900">
      <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Pon en práctica lo que leíste</h2>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">Explora nuestros cursos gratuitos para bachillerato.</p>
      <DuiAction to="/cursos" color="primary" class="mt-5">Ver cursos</DuiAction>
    </aside>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '~/types/api'

const { data: post } = await useApi<Post>(`/content/posts/${useRoute().params.slug}`)
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado', fatal: true })

useSeo({ title: post.value.name, description: post.value.description ?? '', type: 'article', image: post.value.picture })

useSeoMeta({
  articleAuthor: [post.value.user?.fullName ?? 'DMA'],
  articlePublishedTime: post.value.createdAt,
  articleTag: post.value.tags ?? [],
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.value.name,
      description: post.value.description,
      image: post.value.picture ?? undefined,
      datePublished: post.value.createdAt,
      author: { '@type': 'Person', name: post.value.user?.fullName },
      publisher: { '@type': 'Organization', name: 'DMA · Droni.co Modern Academy' },
    }),
  }],
})
</script>
