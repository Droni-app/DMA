<template>
  <div v-if="course">
    <LessonVideo v-if="course.video" :src="course.video" :title="course.name" :group="course.group" />
    <CourseCover v-else :group="course.group" :picture="course.picture" class="h-40 w-full !rounded-none sm:h-56" />

    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div class="grid gap-10 lg:grid-cols-[1fr_320px]">
        <!-- Presentación -->
        <div>
          <nav aria-label="Ruta de navegación" class="text-sm text-zinc-500 dark:text-zinc-400">
            <NuxtLink to="/cursos" class="hover:underline">Cursos</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink :to="{ path: '/cursos', query: { materia: info.subject } }" class="hover:underline">{{ info.subject }}</NuxtLink>
          </nav>
          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{{ course.name }}</h1>
          <div class="mt-4 flex flex-wrap gap-2">
            <DuiBadge :label="info.subject" variant="soft" />
            <DuiBadge v-if="info.grade" :label="`Grado ${info.grade}`" variant="outline" color="neutral" />
            <DuiBadge :label="`${lessons.length} lecciones`" variant="outline" color="neutral" />
          </div>
          <p class="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-600 dark:text-zinc-400">{{ course.description }}</p>

          <h2 class="mt-10 text-xl font-bold text-zinc-900 dark:text-white">Lecciones</h2>
          <ol v-if="lessons.length" class="mt-4 divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            <li v-for="(lesson, i) in lessons" :key="lesson.id">
              <NuxtLink :to="`/cursos/${slug}/${lesson.slug}`" class="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <i
                  v-if="isStudent"
                  class="text-2xl"
                  :class="isDone(lesson) ? 'mdi mdi-check-circle text-emerald-500' : 'mdi mdi-circle-outline text-zinc-300 dark:text-zinc-600'"
                  aria-hidden="true"
                />
                <span v-else class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{{ i + 1 }}</span>
                <span class="flex-1">
                  <span class="block font-medium text-zinc-900 dark:text-white">
                    {{ lesson.name }}
                    <DuiBadge v-if="!isTrue(lesson.active)" label="Oculta" color="warning" variant="soft" size="xs" class="ml-1" />
                  </span>
                  <span v-if="lesson.description" class="block text-sm text-zinc-500">{{ lesson.description }}</span>
                </span>
                <DuiBadge v-if="isStudent && isDone(lesson)" label="Vista" color="success" variant="soft" size="sm" />
                <DuiBadge v-else-if="isStudent && lesson.id === next?.id" label="Siguiente" variant="soft" size="sm" />
                <i v-else-if="lesson.video" class="mdi mdi-play-circle-outline text-xl text-zinc-400" title="Incluye video" />
                <i class="mdi mdi-chevron-right text-xl text-zinc-400" aria-hidden="true" />
              </NuxtLink>
            </li>
          </ol>
          <EmptyState v-else class="mt-4" icon="mdi mdi-book-clock-outline" title="Las lecciones llegarán pronto" />

        </div>

        <!-- Avance / llamado a la acción -->
        <aside>
          <div class="rounded-2xl border border-zinc-200 p-6 lg:sticky lg:top-20 dark:border-zinc-800">
            <!-- Docentes y administradores del curso -->
            <template v-if="canManage">
              <DuiBadge :label="roleLabels[role] ?? role" variant="soft" />
              <h2 class="mt-3 font-semibold text-zinc-900 dark:text-white">Gestiona este curso</h2>
              <div class="mt-4 grid gap-2">
                <DuiAction :to="`/cursos/${slug}/lecciones/nueva`" variant="outline" color="neutral" block>
                  <i class="mdi mdi-plus-circle-outline mr-1" aria-hidden="true" /> Nueva lección
                </DuiAction>
                <DuiAction :to="`/cursos/${slug}/preguntas`" variant="outline" color="neutral" block>
                  <i class="mdi mdi-help-circle-outline mr-1" aria-hidden="true" /> Banco de preguntas
                </DuiAction>
                <DuiAction :to="`/cursos/${slug}/estudiantes`" variant="outline" color="neutral" block>
                  <i class="mdi mdi-account-group-outline mr-1" aria-hidden="true" /> Estudiantes
                </DuiAction>
              </div>
            </template>

            <template v-else-if="enrollment">
              <h2 class="font-semibold text-zinc-900 dark:text-white">Tu avance</h2>
              <p class="mt-4 text-4xl font-extrabold text-zinc-900 dark:text-white">{{ percent }}%</p>
              <ProgressBar :value="percent" class="mt-3" />
              <p class="mt-3 text-sm text-zinc-500">{{ doneCount }} de {{ lessons.length }} lecciones completadas</p>
              <DuiAlert v-if="percent === 100" color="success" variant="outline" class="mt-5">¡Completaste el curso! 🎉</DuiAlert>
              <template v-else-if="next">
                <p class="mt-6 text-sm text-zinc-500">{{ doneCount ? 'Continúa con' : 'Empieza con' }}</p>
                <p class="font-medium text-zinc-900 dark:text-white">{{ next.name }}</p>
              </template>
            </template>

            <template v-else>
              <p class="text-2xl font-bold text-zinc-900 dark:text-white">Gratis</p>
              <p class="mt-2 text-sm text-zinc-500">
                Todo el contenido es abierto.
                {{ user ? 'Inscríbete para guardar tu avance y enviar actividades.' : 'Crea tu cuenta para guardar tu avance y enviar actividades.' }}
              </p>
              <DuiAlert v-if="error" color="danger" variant="outline" class="mt-4">{{ error }}</DuiAlert>
              <template v-if="user">
                <DuiButton v-if="autoEnroll" color="primary" block class="mt-5" :loading="enrolling" @click="join">Inscribirme gratis</DuiButton>
                <DuiAlert v-else color="neutral" variant="outline" class="mt-5">
                  La inscripción a este curso la hace tu docente o institución.
                </DuiAlert>
              </template>
              <DuiAction v-else :to="{ path: '/registro', query: { redirect: route.path } }" variant="outline" color="neutral" block class="mt-5">Crear cuenta gratis</DuiAction>
            </template>

            <DuiAction v-if="next" :to="`/cursos/${slug}/${next.slug}`" :color="enrollment || !user || !autoEnroll ? 'primary' : 'neutral'" :variant="enrollment || !user || !autoEnroll ? 'solid' : 'outline'" size="lg" block class="mt-3">
              {{ canManage ? 'Ver lecciones' : percent === 100 ? 'Repasar el curso' : doneCount ? 'Continuar' : enrollment ? 'Comenzar curso' : 'Ver lecciones' }}
            </DuiAction>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseGroup } from '~/data/subjects'

definePageMeta({ layout: 'course' })

const route = useRoute()
const slug = String(route.params.slug)
const { course, lessons, enrollment, role, canManage, isDone, doneCount, percent, next, enroll } = await useCourse(slug)
if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })

const info = computed(() => parseGroup(course.value!.group))
const { user } = useAuth()
const autoEnroll = computed(() => isTrue(course.value?.autoEnroll))
const isStudent = computed(() => role.value === 'student')

useSeo({
  title: `${course.value.name} · ${info.value.subject}${info.value.grade ? ` grado ${info.value.grade}` : ''}`,
  description: (course.value.description ?? '').slice(0, 160),
  image: course.value.picture,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.value.name,
      description: course.value.description,
      image: course.value.picture ?? undefined,
      educationalLevel: info.value.grade ? `Grado ${info.value.grade}` : undefined,
      provider: { '@type': 'Organization', name: 'DMA · Droni.co Modern Academy' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'COP', category: 'Free' },
      hasPart: lessons.value.map(lesson => ({ '@type': 'LearningResource', name: lesson.name })),
    }),
  }],
})

const enrolling = ref(false)
const error = ref('')

async function join() {
  enrolling.value = true
  error.value = ''
  try {
    await enroll()
  } catch (e) {
    error.value = apiError(e, 'No pudimos inscribirte. Intenta de nuevo.')
  } finally {
    enrolling.value = false
  }
}
</script>
