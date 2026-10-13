<template>
  <header class="sticky top-0 z-40">
    <DuiNavbar :items="items" items-alignment="center">
      <template #brand>
        <AppLogo />
      </template>
      <template #actions>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <template v-if="user">
            <DuiAction to="/panel" color="primary">
              <i class="mdi mdi-view-dashboard-outline mr-1" aria-hidden="true" /> Mi panel
            </DuiAction>
          </template>
          <template v-else>
            <DuiAction to="/login" variant="ghost" color="neutral">Ingresar</DuiAction>
            <DuiAction to="/registro" color="primary">Crear cuenta</DuiAction>
          </template>
        </div>
      </template>
    </DuiNavbar>
  </header>
</template>

<script setup lang="ts">
const { user } = useAuth()
const route = useRoute()

const items = computed(() =>
  [
    { label: 'Inicio', to: '/' },
    { label: 'Cursos', to: '/cursos' },
    { label: 'Blog', to: '/blog' },
    { label: 'Comunidad', to: '/comunidad' },
  ].map(item => ({
    ...item,
    active: item.to === '/' ? route.path === '/' : route.path.startsWith(item.to),
  })),
)
</script>
