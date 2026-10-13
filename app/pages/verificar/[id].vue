<template>
  <div class="text-center">
    <span
      class="mx-auto grid size-16 place-items-center rounded-full"
      :class="error ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'"
    >
      <i :class="error ? 'mdi mdi-email-alert-outline' : 'mdi mdi-check-decagram-outline'" class="text-3xl" aria-hidden="true" />
    </span>
    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
      {{ error ? 'No pudimos verificar tu correo' : '¡Correo verificado!' }}
    </h1>
    <p class="mt-3 text-zinc-600 dark:text-zinc-400">
      {{ error ? 'El enlace no es válido o ya fue usado.' : 'Tu cuenta está activa. Ya puedes ingresar.' }}
    </p>
    <DuiAction to="/login" color="primary" size="lg" block class="mt-8">Ingresar</DuiAction>
  </div>
</template>

<script setup lang="ts">
// Enlace del correo de verificación: /verificar/{enrollmentId}
definePageMeta({ layout: 'auth' })
useSeo({ title: 'Verificar correo', description: 'Verificación de tu cuenta DMA.', noindex: true })

const { error } = await useApi(`/auth/verify-email/${useRoute().params.id}`)
</script>
