<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-x-0 -top-40 -z-10 mx-auto h-96 max-w-3xl rounded-full bg-slate-200/60 blur-3xl dark:bg-slate-800/40" />
      <div class="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <DuiBadge label="Nuevo: simulacros Saber 11 con explicación" variant="soft" rounded="full" />
        <h1 class="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
          Refuerza el colegio y aprende <span class="text-slate-500 dark:text-slate-400">a tu ritmo</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Cursos cortos y claros de matemáticas, lenguaje, ciencias e inglés para bachillerato, con ejercicios que se corrigen al instante y preparación para el Saber 11.
        </p>
        <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <DuiAction to="/registro" color="primary" size="lg">Empieza gratis</DuiAction>
          <DuiAction to="/cursos" variant="outline" color="neutral" size="lg">Ver cursos</DuiAction>
        </div>
        <dl class="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label">
            <dt class="text-sm text-zinc-500 dark:text-zinc-400">{{ stat.label }}</dt>
            <dd class="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Materias -->
    <section class="bg-zinc-50 py-20 dark:bg-zinc-900" aria-labelledby="materias">
      <div class="mx-auto max-w-6xl px-4">
        <h2 id="materias" class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Explora por materia</h2>
        <p class="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Todo lo que ves en clase, explicado de otra forma.</p>
        <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <NuxtLink
            v-for="subject in subjects"
            :key="subject.slug"
            :to="`/cursos?materia=${subject.slug}`"
            class="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white" :class="subject.cover">
              <i :class="subject.icon" class="text-2xl" aria-hidden="true" />
            </span>
            <span class="font-medium text-zinc-800 dark:text-zinc-200">{{ subject.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Cursos destacados -->
    <section class="py-20" aria-labelledby="destacados">
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 id="destacados" class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Cursos más populares</h2>
            <p class="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Elegidos por miles de estudiantes este mes.</p>
          </div>
          <DuiAction to="/cursos" variant="ghost" color="neutral" class="hidden sm:inline-flex">Ver todos →</DuiAction>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard v-for="course in featured" :key="course.id" :course="course" />
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="bg-zinc-50 py-20 dark:bg-zinc-900" aria-labelledby="como-funciona">
      <div class="mx-auto max-w-6xl px-4">
        <h2 id="como-funciona" class="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Así de simple funciona</h2>
        <div class="mt-12 grid gap-10 md:grid-cols-3">
          <div v-for="(step, i) in steps" :key="step.title" class="text-center">
            <span class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-800 text-white dark:bg-white dark:text-slate-900">
              <i :class="step.icon" class="text-3xl" aria-hidden="true" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-zinc-900 dark:text-white">{{ i + 1 }}. {{ step.title }}</h3>
            <p class="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Preguntas frecuentes -->
    <section class="py-20" aria-labelledby="faq">
      <div class="mx-auto max-w-3xl px-4">
        <h2 id="faq" class="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Preguntas frecuentes</h2>
        <DuiAccordion :items="faq" variant="separated" class="mt-10" />
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 pb-20">
      <div class="mx-auto max-w-6xl rounded-3xl bg-slate-900 px-6 py-16 text-center text-white sm:px-16">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">¿Listo para subir tus notas?</h2>
        <p class="mx-auto mt-4 max-w-xl text-lg text-slate-300">Crea tu cuenta gratis y empieza hoy con tu primera lección.</p>
        <DuiAction to="/registro" color="neutral" size="lg" class="mt-8">Crear cuenta gratis</DuiAction>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { courses, subjects } from '~/data/courses'

useSeo({
  title: 'Refuerzo escolar en línea para bachillerato',
  description: 'DMA (Droni.co Modern Academy): cursos virtuales de matemáticas, lenguaje, ciencias, inglés y preparación Saber 11 para estudiantes de 6° a 11°.',
})

const featured = [...courses].sort((a, b) => b.students - a.students).slice(0, 6)

const stats = [
  { label: 'Estudiantes', value: '12.000+' },
  { label: 'Cursos', value: `${courses.length}` },
  { label: 'Lecciones', value: `${courses.reduce((n, c) => n + c.lessons.length, 0)}` },
  { label: 'Calificación', value: '4.8★' },
]

const steps = [
  { icon: 'mdi mdi-account-plus-outline', title: 'Crea tu cuenta', text: 'Regístrate gratis en menos de un minuto con tu correo o tu cuenta de Google.' },
  { icon: 'mdi mdi-book-open-page-variant-outline', title: 'Elige un curso', text: 'Busca por grado o materia y avanza con lecciones cortas, fáciles de leer.' },
  { icon: 'mdi mdi-check-decagram-outline', title: 'Practica y mejora', text: 'Resuelve quizzes con retroalimentación inmediata y mide tu progreso.' },
]

const faq = [
  { title: '¿DMA es gratis?', value: 'gratis', content: 'Sí. Puedes crear tu cuenta y tomar los cursos sin costo.' },
  { title: '¿Para qué grados son los cursos?', value: 'grados', content: 'Los cursos están pensados para bachillerato, de 6° a 11°, siguiendo los estándares del Ministerio de Educación.' },
  { title: '¿Sirve para prepararme para el Saber 11?', value: 'saber', content: 'Sí. Tenemos simulacros con preguntas tipo ICFES y explicaciones de cada respuesta.' },
  { title: '¿Puedo estudiar desde el celular?', value: 'celular', content: 'Claro. DMA funciona en cualquier dispositivo y tiene modo oscuro para estudiar de noche.' },
]

// Datos estructurados de las preguntas frecuentes para Google
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(q => ({ '@type': 'Question', name: q.title, acceptedAnswer: { '@type': 'Answer', text: q.content } })),
    }),
  }],
})
</script>
