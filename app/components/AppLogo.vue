<template>
  <NuxtLink
    to="/"
    class="group inline-flex items-center gap-2.5 font-extrabold tracking-tight text-zinc-900 transition-opacity hover:opacity-95 dark:text-white"
    aria-label="DMA · Droni.co Modern Academy, ir al inicio"
  >
    <!-- Contenedor del isotipo (elefante iconográfico) -->
    <span
      class="relative grid place-items-center overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-900 shadow-sm transition-transform duration-200 group-hover:scale-105 dark:border-zinc-800 dark:bg-zinc-950"
      :class="boxClass"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-full p-1"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-ele-violet" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stop-color="#a175fd" />
            <stop offset="50%" stop-color="#7130eb" />
            <stop offset="100%" stop-color="#4e1ca9" />
          </linearGradient>
          <linearGradient id="logo-ele-ear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f23282" />
            <stop offset="40%" stop-color="#8a4cf7" />
            <stop offset="100%" stop-color="#31106e" />
          </linearGradient>
          <linearGradient id="logo-ele-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#67e2f9" />
            <stop offset="100%" stop-color="#088db2" />
          </linearGradient>
        </defs>

        <!-- Cuerpo y cabeza -->
        <path
          d="M 38,72 C 34,68 33,58 35,48 C 37,38 45,30 55,28 C 65,26 73,30 78,38 C 76,48 71,58 64,65 C 56,73 45,75 38,72 Z"
          fill="url(#logo-ele-violet)"
        />
        <!-- Trompa erguida (sabiduría y progreso) -->
        <path
          d="M 73,34 C 80,40 84,50 82,60 C 80,68 82,75 88,74 C 93,73 95,66 93,57 C 92,52 93,48 95,47 C 97,46 99,50 98,56 C 96,69 88,80 79,78 C 72,76 72,67 74,58 C 76,49 76,42 70,36 C 67,33 63,31 58,30 C 63,28 68,29 73,34 Z"
          fill="url(#logo-ele-violet)"
        />
        <!-- Colmillo en tono cian -->
        <path
          d="M 64,56 C 70,58 78,60 83,54 C 80,60 74,64 66,63 C 63,62 62,59 64,56 Z"
          fill="url(#logo-ele-cyan)"
        />
        <!-- Oreja geométrica (inspirada en pliegue/página de libro) -->
        <path
          d="M 45,26 C 32,24 20,34 17,47 C 14,62 23,76 38,80 C 47,82 53,76 54,66 C 55,54 53,42 49,34 C 48,30 46,27 45,26 Z"
          fill="url(#logo-ele-ear)"
        />
        <path
          d="M 40,33 C 31,32 23,39 21,50 C 19,61 26,71 36,73 C 43,74 47,69 48,61 C 49,52 47,44 44,38 C 43,35 41,33 40,33 Z"
          fill="#ffffff"
          opacity="0.15"
        />
        <!-- Ojo de curiosidad y aprendizaje -->
        <circle cx="61" cy="37" r="2.8" fill="#ffffff" />
        <circle cx="61.8" cy="36.6" r="1.3" fill="#080a18" />
        <!-- Destello de conocimiento -->
        <path
          d="M 97,36 L 98.2,39.5 L 101.7,40.7 L 98.2,42 L 97,45.5 L 95.8,42 L 92.3,40.7 L 95.8,39.5 Z"
          fill="#67e2f9"
        />
      </svg>
    </span>

    <!-- Tipografía de marca -->
    <span v-if="withText" class="flex flex-col">
      <span class="flex items-center gap-1 leading-none">
        <span :class="textClass" class="font-extrabold tracking-tight">DMA</span>
        <span class="size-1.5 rounded-full bg-cyan-400" />
      </span>
      <span v-if="withSubtitle" class="text-[9px] font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400">
        Academy
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    withText?: boolean
    withSubtitle?: boolean
  }>(),
  {
    size: 'md',
    withText: true,
    withSubtitle: false,
  },
)

const boxClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-7 rounded-lg'
    case 'lg':
      return 'size-12 rounded-2xl'
    default:
      return 'size-9 rounded-xl'
  }
})

const textClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-lg'
    case 'lg':
      return 'text-2xl'
    default:
      return 'text-xl'
  }
})
</script>
