<template>
  <div v-if="course">
    <NuxtLink to="/panel/admin/cursos" class="text-sm text-zinc-500 hover:underline">← Todos los cursos</NuxtLink>
    <div class="mt-3 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{{ course.name }}</h1>
        <p class="mt-1 text-zinc-500">/cursos/{{ course.slug }}</p>
      </div>
      <DuiAction :to="`/cursos/${course.slug}`" variant="outline" color="neutral">
        <i class="mdi mdi-open-in-new mr-1" aria-hidden="true" /> Ver curso
      </DuiAction>
    </div>

    <DuiTabs v-model="tab" :tabs="tabs" class="mt-6" aria-label="Secciones del curso">
      <template #datos>
        <DuiForm class="max-w-2xl space-y-5 pt-6" :loading="saving" @submit="save">
          <DuiLabel title="Nombre" required help-text="Si lo cambias, también cambia la URL del curso.">
            <DuiInput v-model="form.name" required block />
          </DuiLabel>
          <DuiLabel title="Grupo" help-text="Materia y grado, por ejemplo «Matemáticas · 8»">
            <DuiInput v-model="form.group" block />
          </DuiLabel>
          <DuiLabel title="Descripción">
            <DuiTextarea v-model="form.description" rows="5" block autoheight />
          </DuiLabel>
          <DuiLabel title="Imagen de portada">
            <div class="flex items-center gap-4">
              <CourseCover :group="form.group" :picture="form.picture" class="h-20 w-32 shrink-0" />
              <div class="min-w-0 flex-1 space-y-2">
                <DuiInput v-model="form.picture" type="url" placeholder="https://…" block />
                <label class="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-700 underline dark:text-slate-300">
                  <i :class="uploading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-upload'" aria-hidden="true" /> Subir imagen
                  <input type="file" accept=".jpg,.jpeg,.png" class="sr-only" @change="uploadPicture">
                </label>
              </div>
            </div>
          </DuiLabel>
          <DuiLabel title="Video de presentación" help-text="Enlace de YouTube o Vimeo.">
            <DuiInput v-model="form.video" type="url" placeholder="https://youtube.com/…" block />
          </DuiLabel>
          <DuiSwitch v-model="form.auto_enroll" label="Inscripción abierta" description="Los estudiantes pueden inscribirse solos." />
          <DuiSwitch v-model="form.active" label="Publicado" description="Visible en el catálogo." />

          <div class="flex flex-wrap gap-3">
            <DuiButton type="submit" color="primary" :loading="saving">Guardar cambios</DuiButton>
            <DuiButton type="button" variant="ghost" color="danger" class="sm:ml-auto" :loading="deleting" @click="remove">
              <i class="mdi mdi-delete-outline mr-1" aria-hidden="true" /> Eliminar curso
            </DuiButton>
          </div>
        </DuiForm>
      </template>

      <template #personas>
        <div class="pt-6">
          <AdminEnrollments :course-id="course.id" />
        </div>
      </template>
    </DuiTabs>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Course } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'owner' })

const route = useRoute()
const id = String(route.params.id)
const { data: course, refresh } = await useApi<Course>(`/admin/learn/courses/${id}`)
if (!course.value) throw createError({ statusCode: 404, statusMessage: 'Curso no encontrado', fatal: true })

useSeo({ title: `Administrar ${course.value.name}`, description: 'Administración del curso.', noindex: true })

const toast = useToast()
const tab = ref(String(route.query.tab ?? 'datos'))
const tabs = [
  { label: 'Datos del curso', value: 'datos', icon: 'mdi mdi-cog-outline' },
  { label: 'Docentes y estudiantes', value: 'personas', icon: 'mdi mdi-account-group-outline' },
]

const form = reactive({
  name: course.value.name,
  group: course.value.group ?? '',
  description: course.value.description ?? '',
  picture: course.value.picture ?? '',
  video: course.value.video ?? '',
  auto_enroll: isTrue(course.value.autoEnroll),
  active: isTrue(course.value.active),
})

const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false)

async function uploadPicture(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    form.picture = (await uploadFile(file)).url
  } catch (e) {
    toast.error(apiError(e, 'No pudimos subir la imagen.'))
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function save() {
  saving.value = true
  try {
    await apiFetch(`/admin/learn/courses/${id}`, {
      method: 'PUT',
      body: {
        ...form,
        group: form.group || null,
        description: form.description || null,
        picture: form.picture || null,
        video: form.video || null,
      },
    })
    await refresh()
    toast.success('Los cambios se guardaron.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos guardar los cambios.'))
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!window.confirm(`¿Eliminar el curso «${course.value?.name}»? Se perderán sus lecciones, inscripciones y entregas.`)) return
  deleting.value = true
  try {
    await apiFetch(`/admin/learn/courses/${id}`, { method: 'DELETE' })
    toast.success('El curso fue eliminado.')
    await navigateTo('/panel/admin/cursos')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar el curso.'))
  } finally {
    deleting.value = false
  }
}
</script>
