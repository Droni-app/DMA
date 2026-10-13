<template>
  <div>
    <PageHeader
      eyebrow="Comunidad"
      title="Pregunta, responde y aprende con otros"
      description="Un espacio para resolver dudas entre estudiantes y profesores."
    >
      <DuiButton color="primary" class="mt-8" @click="newTopic">
        <i class="mdi mdi-plus mr-1" aria-hidden="true" /> Nueva pregunta
      </DuiButton>
    </PageHeader>

    <div class="mx-auto max-w-4xl px-4 py-10">
      <DuiTabs v-if="tabs.length > 2" v-model="group" :tabs="tabs" variant="pills" aria-label="Filtrar por materia" />

      <ul v-if="filtered.length" class="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        <li v-for="topic in filtered" :key="topic.id">
          <NuxtLink :to="`/comunidad/${topic.slug}`" class="flex gap-4 py-5 hover:bg-zinc-50 sm:rounded-xl sm:px-4 dark:hover:bg-zinc-900">
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-100 font-semibold dark:bg-zinc-800">{{ topic.user?.fullName?.[0] ?? '?' }}</span>
            <div class="min-w-0 flex-1">
              <h2 class="font-semibold text-zinc-900 dark:text-white">{{ topic.name }}</h2>
              <p class="mt-1 line-clamp-1 text-zinc-600 dark:text-zinc-400">{{ topic.content }}</p>
              <p class="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <DuiBadge v-if="topic.group" :label="topic.group" variant="soft" size="xs" />
                <span>{{ topic.user?.fullName }} · {{ formatDate(topic.createdAt) }}</span>
              </p>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <EmptyState v-else class="mt-6" icon="mdi mdi-forum-outline" title="Aún no hay preguntas" text="¡Sé el primero en preguntar!" />
    </div>

    <ClientOnly>
      <DuiModal v-model="showForm" title="Nueva pregunta" description="Cuéntale a la comunidad qué necesitas.">
        <DuiForm :loading="sending" @submit="createTopic">
          <DuiLabel title="Título" required>
            <DuiInput v-model="form.name" placeholder="Ej: ¿Cómo despejo una ecuación?" required block />
          </DuiLabel>
          <DuiLabel title="Materia">
            <DuiSelect v-model="form.group" :options="subjects.map(s => ({ label: s.name, value: s.name }))" block />
          </DuiLabel>
          <DuiLabel title="Tu pregunta" required>
            <DuiTextarea v-model="form.content" rows="5" required block />
          </DuiLabel>
          <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>
          <template #footer>
            <DuiButton type="submit" color="primary" block :loading="sending">Publicar</DuiButton>
          </template>
        </DuiForm>
      </DuiModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import { subjects } from '~/data/subjects'
import type { Paginated, Topic } from '~/types/api'

useSeo({
  title: 'Comunidad de estudiantes',
  description: 'Foro de estudiantes de bachillerato: resuelve dudas de matemáticas, lenguaje, ciencias, inglés y Saber 11 con la comunidad DMA.',
})

const { user } = useAuth()
const toast = useToast()
const { data: topics, refresh } = await useApi<Paginated<Topic>>('/social/topics?per_page=100')

const group = ref('')
const groups = computed(() => [...new Set((topics.value?.data ?? []).map(t => t.group).filter(Boolean))] as string[])
const tabs = computed(() => [{ label: 'Todas', value: '' }, ...groups.value.map(g => ({ label: g, value: g }))])
const filtered = computed(() => (topics.value?.data ?? []).filter(t => !group.value || t.group === group.value))

const showForm = ref(false)
const sending = ref(false)
const error = ref('')
const form = reactive({ name: '', group: subjects[0]!.name, content: '' })

function newTopic() {
  if (!user.value) return navigateTo({ path: '/login', query: { redirect: '/comunidad' } })
  showForm.value = true
}

async function createTopic() {
  sending.value = true
  error.value = ''
  try {
    await apiFetch('/social/topics', { method: 'POST', body: form })
    await refresh()
    showForm.value = false
    Object.assign(form, { name: '', content: '' })
    toast.success('Tu pregunta fue publicada.')
  } catch (e) {
    error.value = apiError(e, 'No pudimos publicar tu pregunta.')
  } finally {
    sending.value = false
  }
}
</script>
