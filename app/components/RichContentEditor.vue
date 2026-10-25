<template>
  <section class="space-y-2">
    <label class="block text-sm font-medium text-zinc-800 dark:text-zinc-200">{{ label }}</label>

    <template v-if="format === 'text'">
      <DuiTextarea v-model="text" :rows="rows" :placeholder="placeholder" block autoheight />
    </template>

    <template v-else-if="format === 'markdown'">
      <div class="flex flex-wrap gap-1 rounded-t-lg border border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900">
        <button
          v-for="tool in markdownTools"
          :key="tool.label"
          type="button"
          class="rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
          :aria-label="tool.label"
          :title="tool.label"
          @click="insertMarkdown(tool.before, tool.after)"
        >
          {{ tool.icon }}
        </button>
        <button
          type="button"
          class="ml-auto rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
          :aria-pressed="showPreview"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? 'Ocultar vista previa' : 'Vista previa' }}
        </button>
      </div>
      <div :class="showPreview ? 'grid gap-3 lg:grid-cols-2' : ''">
        <textarea
          ref="markdownInput"
          v-model="text"
          :rows="rows"
          :placeholder="placeholder"
          class="block min-h-48 w-full resize-y rounded-b-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          :class="{ 'rounded-t-none': !showPreview }"
          @input="emitValue"
        />
        <div v-if="showPreview" class="reading min-h-48 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800" v-html="renderContent(text, 'markdown')" />
      </div>
    </template>

    <template v-else>
      <div class="overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
        <div class="flex flex-wrap gap-1 border-b border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            v-for="tool in htmlTools"
            :key="tool.label"
            type="button"
            class="rounded px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
            :aria-label="tool.label"
            :title="tool.label"
            @mousedown.prevent
            @click="applyHtmlCommand(tool.command, tool.value)"
          >
            {{ tool.icon }}
          </button>
        </div>
        <div
          ref="htmlInput"
          class="reading !w-full !max-w-none min-h-48 p-4 outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500/30"
          contenteditable="true"
          role="textbox"
          aria-multiline="true"
          :aria-label="label"
          @input="emitHtml"
          @paste="pastePlainText"
        />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { sanitizeContent } from '~/utils/content'

const props = withDefaults(defineProps<{
  modelValue: string
  format: string
  label: string
  placeholder?: string
  rows?: number
}>(), {
  placeholder: '',
  rows: 10,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const text = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const markdownInput = ref<HTMLTextAreaElement | null>(null)
const htmlInput = ref<HTMLElement | null>(null)
const showPreview = ref(true)

const markdownTools = [
  { label: 'Título', icon: 'H2', before: '## ', after: '' },
  { label: 'Negrita', icon: 'B', before: '**', after: '**' },
  { label: 'Cursiva', icon: 'I', before: '*', after: '*' },
  { label: 'Código', icon: '</>', before: '`', after: '`' },
  { label: 'Enlace', icon: 'Enlace', before: '[', after: '](https://)' },
  { label: 'Lista', icon: '• Lista', before: '- ', after: '' },
]
const htmlTools = [
  { label: 'Negrita', icon: 'B', command: 'bold' },
  { label: 'Cursiva', icon: 'I', command: 'italic' },
  { label: 'Subrayado', icon: 'U', command: 'underline' },
  { label: 'Título', icon: 'H2', command: 'formatBlock', value: 'h2' },
  { label: 'Párrafo', icon: 'P', command: 'formatBlock', value: 'p' },
  { label: 'Lista', icon: '• Lista', command: 'insertUnorderedList' },
  { label: 'Lista numerada', icon: '1. Lista', command: 'insertOrderedList' },
  { label: 'Enlace', icon: 'Enlace', command: 'createLink' },
]

watch(
  () => [props.format, props.modelValue] as const,
  async ([format, value]) => {
    if (format !== 'html') return
    await nextTick()
    const editor = htmlInput.value
    const safeValue = sanitizeContent(value)
    if (editor && editor.innerHTML !== safeValue) editor.innerHTML = safeValue
  },
  { immediate: true, flush: 'post' },
)

function emitValue() {
  emit('update:modelValue', text.value)
}

function insertMarkdown(before: string, after: string) {
  const input = markdownInput.value
  if (!input) return

  const start = input.selectionStart
  const end = input.selectionEnd
  const selected = text.value.slice(start, end) || (before === '## ' || before === '- ' ? 'Texto' : 'texto')
  const insertion = `${before}${selected}${after}`
  text.value = `${text.value.slice(0, start)}${insertion}${text.value.slice(end)}`
  nextTick(() => {
    input.focus()
    input.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

function applyHtmlCommand(command: string, value?: string) {
  const editor = htmlInput.value
  if (!editor) return
  editor.focus()

  if (command === 'createLink') {
    const enteredUrl = window.prompt('Ingresa la URL del enlace')
    if (!enteredUrl) return
    try {
      const url = new URL(enteredUrl, window.location.origin)
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return
      document.execCommand(command, false, url.toString())
    } catch {
      window.alert('Ingresa una URL válida para el enlace.')
      return
    }
  } else {
    document.execCommand(command, false, value)
  }

  emitHtml()
}

function emitHtml() {
  if (htmlInput.value) emit('update:modelValue', sanitizeContent(htmlInput.value.innerHTML))
}

function pastePlainText(event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text/plain')
  if (!pastedText) return

  const selection = window.getSelection()
  if (!selection?.rangeCount || !htmlInput.value?.contains(selection.anchorNode)) return
  const range = selection.getRangeAt(0)
  range.deleteContents()
  const textNode = document.createTextNode(pastedText)
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  emitHtml()
}
</script>
