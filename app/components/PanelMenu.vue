<template>
  <nav aria-label="Panel">
    <div v-for="section in sections" :key="section.title" class="mb-6">
      <p v-if="section.title" class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">{{ section.title }}</p>
      <ul class="space-y-1">
        <li v-for="item in section.items" :key="item.to">
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
    </div>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>()
const route = useRoute()

const { isOwner } = useAuth()

const sections = computed(() => [
  {
    title: '',
    items: [
      { label: 'Mis cursos', to: '/panel', icon: 'mdi mdi-book-open-variant' },
      { label: 'Explorar cursos', to: '/cursos', icon: 'mdi mdi-compass-outline' },
      { label: 'Mis archivos', to: '/panel/archivos', icon: 'mdi mdi-folder-outline' },
      { label: 'Comunidad', to: '/comunidad', icon: 'mdi mdi-forum-outline' },
      { label: 'Mi perfil', to: '/panel/perfil', icon: 'mdi mdi-account-outline' },
    ],
  },
  // Solo el owner del sitio
  ...(isOwner.value
    ? [{
        title: 'Administración',
        items: [
          { label: 'Cursos', to: '/panel/admin/cursos', icon: 'mdi mdi-school-outline' },
          { label: 'Inscripciones', to: '/panel/admin/inscripciones', icon: 'mdi mdi-account-multiple-check-outline' },
          { label: 'Blog', to: '/panel/admin/blog', icon: 'mdi mdi-post-outline' },
          { label: 'Moderación', to: '/panel/admin/moderacion', icon: 'mdi mdi-shield-check-outline' },
        ],
      }]
    : []),
])

function isActive(to: string) {
  return to === '/panel' ? route.path === '/panel' : route.path.startsWith(to)
}
</script>
