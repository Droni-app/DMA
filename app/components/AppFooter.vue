<template>
  <footer class="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <AppLogo />
        <p class="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Droni.co Modern Academy: refuerzo escolar en línea para estudiantes de bachillerato en Colombia.
        </p>
      </div>
      <nav v-for="group in links" :key="group.title" :aria-label="group.title">
        <h2 class="text-sm font-semibold text-zinc-900 dark:text-white">{{ group.title }}</h2>
        <ul class="mt-4 space-y-3 text-sm">
          <li v-for="link in group.items" :key="link.to">
            <NuxtLink :to="link.to" class="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
      © {{ new Date().getFullYear() }} Droni.co · Todos los derechos reservados
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  {
    title: 'Aprende',
    items: [
      { label: 'Todos los cursos', to: '/cursos' },
      { label: 'Matemáticas', to: '/cursos?materia=matematicas' },
      { label: 'Preparación Saber 11', to: '/cursos?materia=saber-11' },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { label: 'Blog', to: '/blog' },
      { label: 'Comunidad', to: '/comunidad' },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { label: 'Ingresar', to: '/login' },
      { label: 'Crear cuenta', to: '/registro' },
    ],
  },
]
</script>
