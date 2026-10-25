<template>
  <div class="max-w-4xl">
    <NuxtLink to="/panel/admin/blog" class="text-sm text-zinc-500 hover:underline">← Todos los artículos</NuxtLink>
    <h1 class="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">{{ isNew ? 'Nuevo artículo' : 'Editar artículo' }}</h1>

    <DuiForm class="mt-6 space-y-5" :loading="saving" @submit="save">
      <DuiLabel title="Título" required>
        <DuiInput v-model="form.name" required block />
      </DuiLabel>
      <DuiLabel title="Resumen">
        <DuiTextarea v-model="form.description" rows="2" block />
      </DuiLabel>
      <DuiLabel title="Etiquetas" help-text="Separadas por comas, por ejemplo: Saber 11, Matemáticas">
        <DuiInput v-model="form.tags" block />
      </DuiLabel>
      <DuiLabel title="Imagen principal">
        <div class="flex items-center gap-4">
          <img v-if="form.picture" :src="form.picture" alt="" class="h-20 w-32 shrink-0 rounded-lg object-cover">
          <div class="min-w-0 flex-1 space-y-2">
            <DuiInput v-model="form.picture" type="url" placeholder="https://…" block />
            <label class="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-700 underline dark:text-slate-300">
              <i :class="uploading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-upload'" aria-hidden="true" /> Subir imagen
              <input type="file" accept=".jpg,.jpeg,.png" class="sr-only" @change="uploadPicture">
            </label>
          </div>
        </div>
      </DuiLabel>
      <RichContentEditor v-model="form.content" format="markdown" label="Contenido" placeholder="Escribe el artículo en markdown" :rows="16" />
      <DuiSwitch v-model="form.active" label="Publicado" description="Si está desactivado queda como borrador." />

      <div class="flex flex-wrap gap-3">
        <DuiButton type="submit" color="primary" :loading="saving">{{ isNew ? 'Crear artículo' : 'Guardar cambios' }}</DuiButton>
        <DuiAction v-if="post && isTrue(post.active)" :to="`/blog/${post.slug}`" variant="outline" color="neutral">Ver artículo</DuiAction>
        <DuiButton v-if="!isNew" type="button" variant="ghost" color="danger" class="sm:ml-auto" @click="remove">
          <i class="mdi mdi-delete-outline mr-1" aria-hidden="true" /> Eliminar
        </DuiButton>
      </div>
    </DuiForm>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Post } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'owner' })

const route = useRoute()
const id = String(route.params.id)
const isNew = id === 'nuevo'
const { data: post } = await useApi<Post>(`/admin/content/posts/${id}`, { immediate: !isNew })
if (!isNew && !post.value) throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado', fatal: true })

useSeo({ title: isNew ? 'Nuevo artículo' : `Editar ${post.value?.name}`, description: 'Administración del blog.', noindex: true })

const toast = useToast()
const saving = ref(false)
const uploading = ref(false)
const form = reactive({
  name: post.value?.name ?? '',
  description: post.value?.description ?? '',
  tags: (post.value?.tags ?? []).join(', '),
  picture: post.value?.picture ?? '',
  content: post.value?.content ?? '',
  active: isNew ? false : isTrue(post.value?.active),
})

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
  const tags = form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  try {
    const saved = await apiFetch<Post>(isNew ? '/admin/content/posts' : `/admin/content/posts/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      body: {
        name: form.name,
        description: form.description || null,
        tags: tags.length ? tags : null,
        picture: form.picture || null,
        content: form.content || null,
        format: 'markdown',
        active: form.active,
      },
    })
    toast.success(isNew ? 'El artículo fue creado.' : 'Los cambios se guardaron.')
    if (isNew) await navigateTo(`/panel/admin/blog/${saved.id}`)
    else post.value = saved
  } catch (e) {
    toast.error(apiError(e, 'No pudimos guardar el artículo.'))
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
  try {
    await apiFetch(`/admin/content/posts/${id}`, { method: 'DELETE' })
    toast.success('El artículo fue eliminado.')
    await navigateTo('/panel/admin/blog')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar el artículo.'))
  }
}
</script>
