<template>
  <NuxtLayout name="default">
    <section class="mx-auto max-w-xl px-4 py-24 text-center">
      <p class="text-6xl font-extrabold text-zinc-300 dark:text-zinc-700">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        {{ error.statusCode === 404 ? 'No encontramos esta página' : 'Algo salió mal' }}
      </h1>
      <p class="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Puede que el enlace esté roto o que la página se haya movido.</p>
      <DuiButton color="primary" class="mt-8" @click="clearError({ redirect: '/' })">Volver al inicio</DuiButton>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
useSeoMeta({ title: props.error.statusCode === 404 ? 'Página no encontrada' : 'Error', robots: 'noindex' })
</script>
