<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Inscripciones</h1>
    <p class="mt-1 mb-6 text-zinc-600 dark:text-zinc-400">Inscribe usuarios, asigna docentes y cambia el estado de cada inscripción.</p>
    <AdminEnrollments />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'panel', middleware: 'owner' })
useSeo({ title: 'Inscripciones', description: 'Administración de inscripciones.', noindex: true })
</script>
