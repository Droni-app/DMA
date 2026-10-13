<template>
  <!-- Se conectará a GET /auth/google/url -->
  <DuiButton variant="outline" color="neutral" block @click="toast.info('El ingreso con Google estará disponible pronto.')">
    <i class="mdi mdi-google mr-2 text-lg" aria-hidden="true" /> Continuar con Google
  </DuiButton>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'

const toast = useToast()
</script>
