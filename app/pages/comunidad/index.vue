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
      <DuiTabs v-model="group" :tabs="tabs" variant="pills" aria-label="Filtrar por materia" />

      <ul class="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        <li v-for="topic in filtered" :key="topic.id">
          <NuxtLink :to="`/comunidad/${topic.slug}`" class="flex gap-4 py-5 hover:bg-zinc-50 sm:rounded-xl sm:px-4 dark:hover:bg-zinc-900">
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-100 font-semibold dark:bg-zinc-800">{{ topic.author[0] }}</span>
            <div class="min-w-0 flex-1">
              <h2 class="font-semibold text-zinc-900 dark:text-white">{{ topic.name }}</h2>
              <p class="mt-1 line-clamp-1 text-zinc-600 dark:text-zinc-400">{{ topic.content }}</p>
              <p class="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <DuiBadge :label="topic.group" variant="soft" size="xs" />
                <span>{{ topic.author }} · {{ formatDate(topic.createdAt) }}</span>
              </p>
            </div>
            <span class="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
              <i class="mdi mdi-comment-outline" aria-hidden="true" /> {{ topic.replies.length }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <DuiModal v-model="showForm" title="Nueva pregunta" description="Cuéntale a la comunidad qué necesitas.">
      <DuiForm @submit="createTopic">
        <DuiLabel title="Título" required>
          <DuiInput v-model="form.name" placeholder="Ej: ¿Cómo despejo una ecuación?" required block />
        </DuiLabel>
        <DuiLabel title="Materia">
          <DuiSelect v-model="form.group" :options="groups.map(g => ({ label: g, value: g }))" block />
        </DuiLabel>
        <DuiLabel title="Tu pregunta" required>
          <DuiTextarea v-model="form.content" rows="5" required block />
        </DuiLabel>
        <template #footer>
          <DuiButton type="submit" color="primary" block>Publicar</DuiButton>
        </template>
      </DuiForm>
    </DuiModal>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import { topics } from '~/data/topics'

useSeo({
  title: 'Comunidad de estudiantes',
  description: 'Foro de estudiantes de bachillerato: resuelve dudas de matemáticas, lenguaje, ciencias, inglés y Saber 11 con la comunidad DMA.',
})

const { user } = useAuth()
const toast = useToast()

const groups = [...new Set(topics.map(t => t.group))]
const tabs = [{ label: 'Todas', value: '' }, ...groups.map(g => ({ label: g, value: g }))]
const group = ref('')
const filtered = computed(() => topics.filter(t => !group.value || t.group === group.value))

const showForm = ref(false)
const form = reactive({ name: '', group: groups[0], content: '' })

function newTopic() {
  if (!user.value) return navigateTo({ path: '/login', query: { redirect: '/comunidad' } })
  showForm.value = true
}

function createTopic() {
  // Se conectará a POST /social/topics
  showForm.value = false
  toast.success('Tu pregunta fue publicada.')
  Object.assign(form, { name: '', content: '' })
}
</script>
