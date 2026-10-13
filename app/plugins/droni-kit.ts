import * as DroniKit from '@dronico/droni-kit'

// Registra todos los componentes Dui* de forma global
export default defineNuxtPlugin((nuxtApp) => {
  for (const [name, component] of Object.entries(DroniKit)) {
    if (name.startsWith('Dui')) nuxtApp.vueApp.component(name, component as any)
  }
})
