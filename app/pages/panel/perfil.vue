<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mi perfil</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Tus datos y preferencias.</p>

    <section class="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div class="flex items-center gap-4">
        <img v-if="user?.avatar" :src="user.avatar" alt="" class="size-16 rounded-full object-cover">
        <span v-else class="grid size-16 place-items-center rounded-full bg-slate-800 text-xl font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
          {{ user?.fullName?.[0] ?? '?' }}
        </span>
        <div>
          <p class="text-lg font-semibold text-zinc-900 dark:text-white">{{ user?.fullName }}</p>
          <p class="text-zinc-600 dark:text-zinc-400">{{ user?.email }}</p>
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Preferencias</h2>
      <div class="mt-4">
        <DuiSwitch :model-value="isDark" label="Modo oscuro" description="Ideal para estudiar de noche." @update:model-value="toggle" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mi perfil', description: 'Tu perfil en DMA.', noindex: true })

// La API aún no tiene endpoint para editar el usuario, por eso el perfil es de solo lectura
const { user } = useAuth()
const { isDark, toggle } = useTheme()
</script>
