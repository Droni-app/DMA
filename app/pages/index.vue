<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <!-- Glow ambiental de fondo con los tonos oficiales de droni-kit -->
      <div class="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-900/30" />
      <div class="pointer-events-none absolute top-20 left-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-900/20" />

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <!-- Textos y llamadas a la acción (Lado izquierdo) -->
          <div class="text-left lg:col-span-7">
            <div class="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:border-purple-800/70 dark:bg-purple-950/40 dark:text-purple-300">
              <span class="size-2 rounded-full bg-cyan-400 animate-pulse" />
              Nuevo: simulacros Saber 11 con explicación en tiempo real
            </div>

            <h1 class="mt-5 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Refuerza el colegio y aprende <span class="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-cyan-300">a tu ritmo</span>
            </h1>

            <p class="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Cursos cortos y claros de matemáticas, lenguaje, ciencias e inglés para bachillerato, con ejercicios que se corrigen al instante y preparación integral para el Saber 11.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <DuiAction to="/registro" color="primary" size="lg">Empieza gratis</DuiAction>
              <DuiAction to="/cursos" variant="outline" color="neutral" size="lg">Explorar cursos</DuiAction>
            </div>

            <!-- Métricas / Puntos clave de valor integrados -->
            <div class="mt-10 grid grid-cols-3 gap-6 border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
              <div>
                <p class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">6° a 11°</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Bachillerato completo</p>
              </div>
              <div>
                <p class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">100%</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Abierto y gratuito</p>
              </div>
              <div>
                <p class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Saber 11</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">Preguntas tipo ICFES</p>
              </div>
            </div>
          </div>

          <!-- Ilustración de identidad visual integrada (Lado derecho) -->
          <div class="relative lg:col-span-5">
            <!-- Aura luminosa ambiental -->
            <div class="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-pink-500/20 blur-2xl dark:from-purple-600/30 dark:via-cyan-500/25 dark:to-pink-600/20" />

            <!-- Contenedor visual fluido sin borde de card rígido -->
            <div class="relative overflow-hidden rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.01]">
              <picture>
                <source srcset="/hero-banner.webp" type="image/webp">
                <img
                  src="/hero-banner.jpg"
                  alt="DMA · Droni.co Modern Academy - Refuerzo escolar virtual y preparación Saber 11"
                  class="aspect-4/3 sm:aspect-16/10 lg:aspect-square w-full object-cover object-right"
                  loading="eager"
                  width="1376"
                  height="768"
                >
              </picture>
              <!-- Sombra degradada para fusión armónica -->
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent dark:from-zinc-950/60" />
            </div>

            <!-- Pill flotante interactivo integrado -->
            <div class="absolute -bottom-3 -left-3 hidden rounded-xl border border-zinc-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:flex sm:items-center sm:gap-3 dark:border-zinc-800 dark:bg-zinc-900/95">
              <span class="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <i class="mdi mdi-check-circle text-lg" aria-hidden="true" />
              </span>
              <div class="text-left">
                <p class="text-xs font-semibold text-zinc-900 dark:text-white">Corrección en tiempo real</p>
                <p class="text-[10px] text-zinc-500 dark:text-zinc-400">Aprende al instante con explicaciones</p>
              </div>
            </div>
          </div>
        </div>
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
            :key="subject.name"
            :to="{ path: '/cursos', query: { materia: subject.name } }"
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
            <h2 id="destacados" class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Cursos recientes</h2>
            <p class="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Empieza hoy con cualquiera de ellos, es gratis.</p>
          </div>
          <DuiAction to="/cursos" variant="ghost" color="neutral" class="hidden sm:inline-flex">Ver todos →</DuiAction>
        </div>
        <div v-if="courses?.data.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard v-for="course in courses.data" :key="course.id" :course="course" />
        </div>
        <EmptyState v-else class="mt-10" icon="mdi mdi-book-clock-outline" title="Muy pronto tendremos cursos aquí" text="Estamos preparando el contenido. ¡Vuelve en unos días!" />
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
import { subjects } from '~/data/subjects'
import type { Course, Paginated } from '~/types/api'

useSeo({
  title: 'Refuerzo escolar en línea para bachillerato',
  description: 'DMA (Droni.co Modern Academy): cursos virtuales de matemáticas, lenguaje, ciencias, inglés y preparación Saber 11 para estudiantes de 6° a 11°.',
})

const { data: courses } = await useApi<Paginated<Course>>('/learn/courses?per_page=6')

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
