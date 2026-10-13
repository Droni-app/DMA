<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <NuxtRouteAnnouncer />

    <!-- Barra lateral en escritorio -->
    <aside class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 lg:flex dark:border-zinc-800 dark:bg-zinc-900">
      <div class="px-2 py-2"><AppLogo /></div>
      <PanelMenu class="mt-6" />
    </aside>

    <!-- Menú lateral en móvil -->
    <ClientOnly>
      <DuiDrawer v-model="menuOpen" position="left" size="sm">
        <div class="p-2"><AppLogo /></div>
        <PanelMenu class="mt-6" @navigate="menuOpen = false" />
      </DuiDrawer>
    </ClientOnly>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <DuiButton variant="ghost" color="neutral" class="lg:hidden" title="Abrir menú" @click="menuOpen = true">
          <i class="mdi mdi-menu text-xl" aria-hidden="true" />
        </DuiButton>
        <span class="lg:hidden"><AppLogo /></span>
        <div class="flex-1" />
        <ThemeToggle />
        <UserMenu />
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
</script>
