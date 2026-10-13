<template>
  <!-- Layout del proceso académico: lecciones y avance a un lado; el contenido usa el resto de la pantalla -->
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <NuxtRouteAnnouncer />

    <aside
      v-if="course && sidebarOpen"
      class="fixed inset-y-0 left-0 z-20 hidden w-80 border-r border-zinc-200 bg-zinc-50 lg:block dark:border-zinc-800 dark:bg-zinc-900"
    >
      <CourseSidebar :slug="slug" />
    </aside>

    <ClientOnly>
      <DuiDrawer v-if="course" v-model="menuOpen" position="left" size="md">
        <CourseSidebar :slug="slug" @navigate="menuOpen = false" />
      </DuiDrawer>
    </ClientOnly>

    <div :class="{ 'lg:pl-80': sidebarOpen }">
      <header class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-zinc-200 bg-white/80 px-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <DuiButton variant="ghost" color="neutral" class="lg:hidden" title="Ver lecciones" @click="menuOpen = true">
          <i class="mdi mdi-menu text-xl" aria-hidden="true" />
        </DuiButton>
        <DuiButton
          variant="ghost"
          color="neutral"
          class="hidden lg:inline-flex"
          :title="sidebarOpen ? 'Ocultar lecciones (modo enfoque)' : 'Mostrar lecciones'"
          @click="sidebarOpen = !sidebarOpen"
        >
          <i :class="sidebarOpen ? 'mdi mdi-dock-left' : 'mdi mdi-page-layout-sidebar-left'" class="text-xl" aria-hidden="true" />
        </DuiButton>
        <p class="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ course?.name }}</p>
        <ThemeToggle />
        <UserMenu v-if="user" />
        <DuiAction v-else :to="{ path: '/login', query: { redirect: route.path } }" color="primary" size="sm">Ingresar</DuiAction>
      </header>

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Se usa siempre dentro de /cursos/[slug]
const route = useRoute()
const slug = String(route.params.slug)
const { user } = useAuth()
const { course } = await useCourse(slug)
const menuOpen = ref(false)
const sidebarOpen = ref(true)
</script>
