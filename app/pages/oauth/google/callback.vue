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
definePageMeta({ layout: 'auth' })
useSeo({ title: 'Ingresando', description: 'Ingreso con Google.', noindex: true })

const route = useRoute()
const { handleGoogleCallback } = useAuth()
const error = ref('')

onMounted(async () => {
  const code = route.query.code
  if (typeof code !== 'string' || !code) {
    error.value = 'Google no devolvió un código de autorización.'
    return
  }

  try {
    await handleGoogleCallback(code)
    await navigateTo('/panel')
  } catch (e) {
    error.value = apiError(e)
  }
})
</script>
