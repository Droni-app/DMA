<template>
  <div class="text-center">
    <template v-if="error">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">No pudimos ingresar con Google</h1>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">{{ error }}</p>
      <DuiAction to="/login" color="primary" class="mt-6">Volver a ingresar</DuiAction>
    </template>
    <template v-else>
      <i class="mdi mdi-loading mdi-spin text-4xl text-zinc-400" aria-hidden="true" />
      <p class="mt-4 text-zinc-600 dark:text-zinc-400">Ingresando con Google…</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/api'

// Google redirige aquí con ?code=…; el backend lo cambia por la sesión
definePageMeta({ layout: 'auth' })
useSeo({ title: 'Ingresando', description: 'Ingreso con Google.', noindex: true })

const route = useRoute()
const { setSession } = useAuth()
const error = ref('')

onMounted(async () => {
  try {
    const query = new URLSearchParams(route.query as Record<string, string>).toString()
    setSession(await apiFetch<{ token: string; user: User }>(`/auth/google/handle?${query}`))
    await navigateTo('/panel')
  } catch (e) {
    error.value = apiError(e)
  }
})
</script>
