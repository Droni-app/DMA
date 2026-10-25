<template>
  <div>
    <!-- Filtros -->
    <div class="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
      <DuiSelect v-if="!courseId" v-model="filters.course" :options="courseOptions" aria-label="Curso" block />
      <span v-else class="hidden sm:block" />
      <DuiSelect v-model="filters.role" :options="[{ label: 'Todos los roles', value: '' }, ...roleOptions]" aria-label="Rol" />
      <DuiSelect v-model="filters.status" :options="[{ label: 'Todos los estados', value: '' }, ...statusOptions]" aria-label="Estado" />
      <DuiButton color="primary" @click="showAdd = true">
        <i class="mdi mdi-account-plus-outline mr-1" aria-hidden="true" /> Inscribir
      </DuiButton>
    </div>

    <DuiAlert v-if="error" color="danger" variant="outline" class="mt-4">{{ apiError(error) }}</DuiAlert>

    <div v-if="enrollments?.data.length" class="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table class="w-full min-w-[720px] divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
        <thead class="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-950">
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold">Persona</th>
            <th v-if="!courseId" scope="col" class="px-4 py-3 font-semibold">Curso</th>
            <th scope="col" class="px-4 py-3 font-semibold">Rol</th>
            <th scope="col" class="px-4 py-3 font-semibold">Estado</th>
            <th scope="col" class="px-4 py-3 font-semibold">Avance</th>
            <th scope="col" class="px-4 py-3"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
          <tr v-for="item in enrollments.data" :key="item.id">
            <td class="px-4 py-3">
              <p class="font-medium text-zinc-900 dark:text-white">{{ userName(item.user) }}</p>
              <p class="text-zinc-500">{{ item.user?.email }}</p>
            </td>
            <td v-if="!courseId" class="px-4 py-3 text-zinc-700 dark:text-zinc-300">{{ item.course?.name ?? courseName(item.courseId) }}</td>
            <td class="px-4 py-3">
              <DuiSelect :model-value="item.role" :options="roleOptions" size="sm" :aria-label="`Rol de ${userName(item.user)}`" @update:model-value="update(item, { role: $event })" />
            </td>
            <td class="px-4 py-3">
              <DuiSelect :model-value="item.status" :options="statusOptions" size="sm" :aria-label="`Estado de ${userName(item.user)}`" @update:model-value="update(item, { status: $event })" />
            </td>
            <td class="w-36 px-4 py-3">
              <div class="flex items-center gap-2">
                <ProgressBar :value="toPercent(item.progress)" class="flex-1" />
                <span class="w-10 text-right tabular-nums text-zinc-500">{{ toPercent(item.progress) }}%</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <DuiButton variant="ghost" color="danger" size="sm" title="Quitar inscripción" @click="remove(item)">
                <i class="mdi mdi-account-remove-outline text-lg" aria-hidden="true" />
              </DuiButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else-if="!error" class="mt-4" icon="mdi mdi-account-multiple-outline" title="No hay inscripciones con estos filtros" />

    <DuiPagination v-if="(enrollments?.meta.lastPage ?? 1) > 1" v-model="page" :total="enrollments!.meta.total" :per-page="enrollments!.meta.perPage" class="mt-6 justify-center" />

    <!-- Inscribir a una persona -->
    <ClientOnly>
      <DuiModal v-model="showAdd" title="Inscribir a una persona" description="Busca un usuario del sitio por nombre o correo.">
        <DuiForm :loading="adding" @submit="add">
          <DuiLabel v-if="!courseId" title="Curso" required>
            <DuiSelect v-model="newEnrollment.course_id" :options="courseOptions.slice(1)" block />
          </DuiLabel>
          <DuiLabel title="Usuario" required>
            <DuiInput v-model="userSearch" type="search" placeholder="Nombre o correo…" block @input="searchUsers" />
          </DuiLabel>
          <ul v-if="users.length" class="max-h-56 divide-y divide-zinc-200 overflow-y-auto rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            <li v-for="u in users" :key="u.id">
              <button
                type="button"
                class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                :class="{ 'bg-slate-100 dark:bg-zinc-800': newEnrollment.user_id === u.id }"
                @click="newEnrollment.user_id = u.id"
              >
                <i :class="newEnrollment.user_id === u.id ? 'mdi mdi-radiobox-marked' : 'mdi mdi-radiobox-blank'" aria-hidden="true" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium">{{ userName(u) }}</span>
                  <span class="block truncate text-zinc-500">{{ u.email }}</span>
                </span>
              </button>
            </li>
          </ul>
          <p v-else-if="userSearch.length > 1 && !searching" class="text-sm text-zinc-500">No encontramos usuarios.</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <DuiLabel title="Rol">
              <DuiSelect v-model="newEnrollment.role" :options="roleOptions" block />
            </DuiLabel>
            <DuiLabel title="Estado">
              <DuiSelect v-model="newEnrollment.status" :options="statusOptions" block />
            </DuiLabel>
          </div>
          <template #footer>
            <DuiButton type="submit" color="primary" block :loading="adding" :disabled="!newEnrollment.user_id || !newEnrollment.course_id">Inscribir</DuiButton>
          </template>
        </DuiForm>
      </DuiModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Course, LearnEnrollment, Paginated, User } from '~/types/api'

// Inscripciones del sitio (o de un curso si llega courseId). Solo para el owner.
const props = defineProps<{ courseId?: string }>()

const toast = useToast()
const page = ref(1)
const filters = reactive({ course: props.courseId ?? '', role: '', status: '' })
watch(filters, () => (page.value = 1))

const { data: enrollments, error, refresh } = await useApi<Paginated<LearnEnrollment>>(() => {
  const query = new URLSearchParams({ per_page: '20', page: String(page.value) })
  if (filters.course) query.set('course_id', filters.course)
  if (filters.role) query.set('role', filters.role)
  if (filters.status) query.set('status', filters.status)
  return `/admin/learn/enrollments?${query}`
})

// Lista de cursos para filtrar y elegir (solo en la vista general)
const { data: courses } = await useApi<Paginated<Course>>('/admin/learn/courses?per_page=200', { immediate: !props.courseId })
const courseOptions = computed(() => [{ label: 'Todos los cursos', value: '' }, ...(courses.value?.data ?? []).map(c => ({ label: c.name, value: c.id }))])
const courseName = (id?: string) => courses.value?.data.find(c => c.id === id)?.name ?? '—'

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({ label, value }))
const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ label, value }))

async function update(item: LearnEnrollment, body: Record<string, string>) {
  try {
    await apiFetch(`/admin/learn/enrollments/${item.id}`, { method: 'PUT', body })
    await refresh()
    toast.success('Inscripción actualizada.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos actualizar la inscripción.'))
  }
}

async function remove(item: LearnEnrollment) {
  if (!window.confirm(`¿Quitar a ${userName(item.user)} del curso? Se perderá su avance.`)) return
  try {
    await apiFetch(`/admin/learn/enrollments/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Inscripción eliminada.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar la inscripción.'))
  }
}

// Inscribir
const showAdd = ref(false)
const adding = ref(false)
const searching = ref(false)
const userSearch = ref('')
const users = ref<User[]>([])
const newEnrollment = reactive({ course_id: props.courseId ?? '', user_id: '', role: 'student', status: 'active' })
let searchTimer: ReturnType<typeof setTimeout> | undefined

function searchUsers() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (userSearch.value.trim().length < 2) return (users.value = [])
    searching.value = true
    try {
      const res = await apiFetch<any>('/admin/learn/site-users', { query: { q: userSearch.value.trim() } })
      // Puede llegar paginado o como lista, de usuarios o de inscripciones con su usuario
      users.value = (Array.isArray(res) ? res : res.data ?? []).map((item: any) => item.user ?? item)
    } catch {
      users.value = []
    } finally {
      searching.value = false
    }
  }, 300)
}

async function add() {
  adding.value = true
  try {
    await apiFetch('/admin/learn/enrollments', { method: 'POST', body: newEnrollment })
    await refresh()
    showAdd.value = false
    Object.assign(newEnrollment, { user_id: '', role: 'student', status: 'active' })
    userSearch.value = ''
    users.value = []
    toast.success('La persona fue inscrita.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos inscribir a esta persona.'))
  } finally {
    adding.value = false
  }
}
</script>
