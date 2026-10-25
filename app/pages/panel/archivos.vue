<template>
  <div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mis archivos</h1>
        <p class="mt-1 text-zinc-600 dark:text-zinc-400">Archivos que subiste en tus actividades. Máximo 10 MB por archivo.</p>
      </div>
      <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
        <i :class="uploading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-upload'" aria-hidden="true" />
        {{ uploading ? 'Subiendo…' : 'Subir archivo' }}
        <input type="file" class="sr-only" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.md" :disabled="uploading" @change="upload">
      </label>
    </div>

    <ul v-if="files?.data.length" class="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      <li v-for="file in files.data" :key="file.id" class="flex items-center gap-4 p-4">
        <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <i :class="icon(file.mime)" class="text-xl text-zinc-500" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <a :href="file.url" target="_blank" rel="noopener" class="block truncate font-medium text-zinc-900 hover:underline dark:text-white">{{ file.name }}</a>
          <p class="text-sm text-zinc-500">{{ formatSize(file.size) }} · {{ formatDate(file.createdAt) }}</p>
        </div>
        <DuiButton variant="ghost" color="danger" size="sm" title="Eliminar archivo" :loading="deletingId === file.id" @click="remove(file)">
          <i class="mdi mdi-delete-outline text-lg" aria-hidden="true" />
        </DuiButton>
      </li>
    </ul>
    <EmptyState v-else class="mt-8" icon="mdi mdi-folder-open-outline" title="Aún no tienes archivos" text="Los archivos que adjuntes en tus actividades aparecerán aquí." />

    <DuiPagination v-if="(files?.meta.lastPage ?? 1) > 1" v-model="page" :total="files!.meta.total" :per-page="files!.meta.perPage" class="mt-8 justify-center" />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import type { Attachment, Paginated } from '~/types/api'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mis archivos', description: 'Tus archivos en DMA.', noindex: true })

const toast = useToast()
const page = ref(1)
const { data: files, refresh } = await useApi<Paginated<Attachment>>(() => `/content/attachments?per_page=20&page=${page.value}`)
const uploading = ref(false)
const deletingId = ref('')

function icon(mime: string) {
  if (mime.startsWith('image/')) return 'mdi mdi-file-image-outline'
  if (mime.includes('pdf')) return 'mdi mdi-file-pdf-box'
  if (mime.includes('word')) return 'mdi mdi-file-word-outline'
  if (mime.includes('sheet') || mime.includes('excel')) return 'mdi mdi-file-excel-outline'
  if (mime.includes('zip')) return 'mdi mdi-folder-zip-outline'
  return 'mdi mdi-file-outline'
}

async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    toast.error('El archivo es demasiado grande (máximo 10 MB).')
    input.value = ''
    return
  }
  uploading.value = true
  try {
    await uploadFile(file)
    await refresh()
    toast.success('Archivo subido.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos subir el archivo.'))
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function remove(file: Attachment) {
  if (!window.confirm(`¿Eliminar «${file.name}»? Los enlaces a este archivo dejarán de funcionar.`)) return
  deletingId.value = file.id
  try {
    await apiFetch(`/content/attachments/${file.id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Archivo eliminado.')
  } catch (e) {
    toast.error(apiError(e, 'No pudimos eliminar el archivo.'))
  } finally {
    deletingId.value = ''
  }
}
</script>
