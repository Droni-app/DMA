<template>
  <nav aria-label="Panel del estudiante">
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'"
          @click="emit('navigate')"
        >
          <i :class="item.icon" class="text-lg" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>()
const route = useRoute()

const items = [
  { label: 'Inicio', to: '/panel', icon: 'mdi mdi-view-dashboard-outline' },
  { label: 'Mis cursos', to: '/panel/cursos', icon: 'mdi mdi-book-open-variant' },
  { label: 'Explorar cursos', to: '/cursos', icon: 'mdi mdi-compass-outline' },
  { label: 'Comunidad', to: '/comunidad', icon: 'mdi mdi-forum-outline' },
  { label: 'Mi perfil', to: '/panel/perfil', icon: 'mdi mdi-account-outline' },
]

function isActive(to: string) {
  return to === '/panel' ? route.path === '/panel' : route.path.startsWith(to)
}
</script>
