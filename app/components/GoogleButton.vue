<template>
  <DuiButton variant="outline" color="neutral" block :loading="loading" @click="start">
    <i class="mdi mdi-google mr-2 text-lg" aria-hidden="true" /> Continuar con Google
  </DuiButton>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'

const { loginWithGoogle } = useAuth()
const toast = useToast()
const loading = ref(false)

async function start() {
  loading.value = true
  try {
    await loginWithGoogle()
  } catch (error) {
    toast.error(apiError(error, 'No pudimos conectar con Google.'))
    loading.value = false
  }
}
</script>
