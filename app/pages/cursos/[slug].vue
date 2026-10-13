<template>
  <div v-if="course">
    <section class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
            <NuxtLink to="/cursos" class="hover:underline">Cursos</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink :to="`/cursos?materia=${subject.slug}`" class="hover:underline">{{ subject.name }}</NuxtLink>
          </nav>
          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{{ course.name }}</h1>
          <p class="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">{{ course.description }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <DuiBadge :label="subject.name" variant="soft" />
            <DuiBadge :label="`Grado ${course.grade}`" variant="outline" color="neutral" />
            <DuiBadge :label="course.level" variant="outline" color="neutral" />
          </div>
          <div class="mt-6 flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <span><i class="mdi mdi-star text-amber-500" aria-hidden="true" /> {{ course.rating }} de calificación</span>
            <span><i class="mdi mdi-account-group-outline" aria-hidden="true" /> {{ course.students.toLocaleString('es-CO') }} estudiantes</span>
            <span><i class="mdi mdi-clock-outline" aria-hidden="true" /> {{ totalMinutes }} min en total</span>
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <CourseCover :subject-slug="course.subject" class="h-40" />
          <p class="mt-5 text-2xl font-bold text-zinc-900 dark:text-white">Gratis</p>
          <DuiButton color="primary" size="lg" block class="mt-4" @click="enroll">
            {{ user ? 'Ir al curso' : 'Inscribirme gratis' }}
          </DuiButton>
          <ul class="mt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><i class="mdi mdi-check text-emerald-500" aria-hidden="true" /> {{ course.lessons.length }} lecciones cortas</li>
            <li><i class="mdi mdi-check text-emerald-500" aria-hidden="true" /> Quizzes con retroalimentación</li>
            <li><i class="mdi mdi-check text-emerald-500" aria-hidden="true" /> Acceso desde cualquier dispositivo</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12">
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">Contenido del curso</h2>
      <ol class="mt-6 max-w-3xl divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        <li v-for="lesson in course.lessons" :key="lesson.id" class="flex items-start gap-4 p-4">
          <span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{{ lesson.order }}</span>
          <div class="flex-1">
            <h3 class="font-medium text-zinc-900 dark:text-white">{{ lesson.name }}</h3>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ lesson.description }}</p>
          </div>
          <span class="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
            <i :class="lesson.format === 'video' ? 'mdi mdi-play-circle-outline' : 'mdi mdi-text-box-outline'" aria-hidden="true" />
            {{ lesson.duration }} min
          </span>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getCourse, getSubject } from '~/data/courses'

const route = useRoute()
const course = getCourse(String(route.params.slug))
if (!course) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })

const subject = getSubject(course.subject)
const totalMinutes = course.lessons.reduce((n, l) => n + l.duration, 0)
const { user } = useAuth()

useSeo({
  title: `${course.name} · Curso de ${subject.name} grado ${course.grade}`,
  description: course.description,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.description,
      educationalLevel: `Grado ${course.grade}`,
      provider: { '@type': 'Organization', name: 'DMA · Droni.co Modern Academy' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'COP', category: 'Free' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: course.rating, ratingCount: course.students },
    }),
  }],
})

function enroll() {
  const target = `/panel/cursos/${course!.slug}/${course!.lessons[0]!.slug}`
  navigateTo(user.value ? target : { path: '/registro', query: { redirect: target } })
}
</script>
