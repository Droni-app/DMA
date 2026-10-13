<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <NuxtRouteAnnouncer />

    <!-- Barra lateral en escritorio -->
    <aside class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 lg:flex dark:border-zinc-800 dark:bg-zinc-900">
      <div class="px-2 py-2"><AppLogo /></div>
      <PanelMenu class="mt-6" />
    </aside>

    <!-- Menú lateral en móvil -->
    <DuiDrawer v-model="menuOpen" position="left" size="sm">
      <div class="p-2"><AppLogo /></div>
      <PanelMenu class="mt-6" @navigate="menuOpen = false" />
    </DuiDrawer>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <DuiButton variant="ghost" color="neutral" class="lg:hidden" title="Abrir menú" @click="menuOpen = true">
          <i class="mdi mdi-menu text-xl" aria-hidden="true" />
        </DuiButton>
        <span class="lg:hidden"><AppLogo /></span>
        <div class="flex-1" />
        <ThemeToggle />
        <DuiDropdown placement="bottom-end" variant="ghost" color="neutral" aria-label="Menú de usuario">
          <template #trigger>
            <span class="flex items-center gap-2">
              <span class="grid size-8 place-items-center rounded-full bg-slate-800 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
                {{ initials }}
              </span>
              <span class="hidden text-sm font-medium sm:inline">{{ user?.fullName }}</span>
            </span>
          </template>
          <DuiDropdownItem label="Mi perfil" icon="mdi mdi-account-outline" @click="navigateTo('/panel/perfil')" />
          <DuiDropdownItem label="Ir al sitio" icon="mdi mdi-home-outline" @click="navigateTo('/')" />
          <DuiDropdownSeparator />
          <DuiDropdownItem label="Cerrar sesión" icon="mdi mdi-logout" danger @click="logout" />
        </DuiDropdown>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const menuOpen = ref(false)

const initials = computed(() =>
  (user.value?.fullName ?? '?')
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>
