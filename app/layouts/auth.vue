<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <NuxtRouteAnnouncer />
    <aside class="relative hidden overflow-hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div class="absolute -right-24 -top-24 size-96 rounded-full bg-slate-700/40 blur-3xl" />
      <div class="relative">
        <AppLogo size="lg" with-subtitle class="text-white dark:text-white" />
      </div>
      <div class="relative">
        <p class="text-3xl font-bold leading-snug">“Aprender a tu ritmo cambia todo. Subí mi promedio de matemáticas en un semestre.”</p>
        <p class="mt-6 text-slate-300">Sofía G. · Estudiante de 10°</p>
      </div>
      <p class="relative text-sm text-slate-400">Droni.co Modern Academy</p>
    </aside>

    <div class="flex flex-col">
      <div class="flex items-center justify-between p-4">
        <span class="lg:invisible"><AppLogo /></span>
        <ThemeToggle />
      </div>
      <main class="flex flex-1 items-center justify-center px-4 pb-12">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
