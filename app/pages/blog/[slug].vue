<template>
  <article v-if="post" class="mx-auto max-w-3xl px-4 py-12 sm:py-16">
    <NuxtLink to="/blog" class="text-sm text-zinc-500 hover:underline dark:text-zinc-400">← Volver al blog</NuxtLink>
    <header class="mt-6">
      <DuiBadge :label="post.tags" variant="soft" />
      <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">{{ post.name }}</h1>
      <p class="mt-4 text-xl leading-8 text-zinc-600 dark:text-zinc-400">{{ post.description }}</p>
      <p class="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Por <strong class="text-zinc-700 dark:text-zinc-300">{{ post.author }}</strong> ·
        <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time> · {{ post.readingTime }} min de lectura
      </p>
    </header>
    <hr class="my-10 border-zinc-200 dark:border-zinc-800">
    <div class="reading" v-html="post.content" />

    <aside class="mt-16 rounded-2xl bg-zinc-50 p-8 text-center dark:bg-zinc-900">
      <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Pon en práctica lo que leíste</h2>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">Explora nuestros cursos gratuitos para bachillerato.</p>
      <DuiAction to="/cursos" color="primary" class="mt-5">Ver cursos</DuiAction>
    </aside>
  </article>
</template>

<script setup lang="ts">
import { getPost } from '~/data/posts'

const post = getPost(String(useRoute().params.slug))
if (!post) throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado', fatal: true })

useSeo({ title: post.name, description: post.description, type: 'article' })

useSeoMeta({
  articleAuthor: [post.author],
  articlePublishedTime: post.createdAt,
  articleTag: [post.tags],
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.name,
      description: post.description,
      datePublished: post.createdAt,
      author: { '@type': 'Person', name: post.author },
      publisher: { '@type': 'Organization', name: 'DMA · Droni.co Modern Academy' },
    }),
  }],
})
</script>
