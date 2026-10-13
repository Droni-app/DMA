<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Mi perfil</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">Actualiza tus datos y preferencias.</p>

    <section class="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Datos personales</h2>
      <DuiForm class="mt-4" @submit="save">
        <DuiLabel title="Nombre completo">
          <DuiInput v-model="form.fullName" autocomplete="name" block />
        </DuiLabel>
        <DuiLabel title="Correo electrónico">
          <DuiInput v-model="form.email" type="email" disabled block />
        </DuiLabel>
        <DuiLabel title="Grado">
          <DuiSelect v-model="form.grade" :options="grades.map(g => ({ label: `Grado ${g}`, value: g }))" block />
        </DuiLabel>
        <template #footer>
          <DuiButton type="submit" color="primary">Guardar cambios</DuiButton>
        </template>
      </DuiForm>
    </section>

    <section class="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Preferencias</h2>
      <div class="mt-4 space-y-4">
        <DuiSwitch :model-value="isDark" label="Modo oscuro" description="Ideal para estudiar de noche." @update:model-value="toggle" />
        <DuiSwitch v-model="form.reminders" label="Recordatorios por correo" description="Te avisamos de tus actividades pendientes." />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@dronico/droni-kit'
import { grades } from '~/data/courses'

definePageMeta({ layout: 'panel', middleware: 'auth' })
useSeo({ title: 'Mi perfil', description: 'Tu perfil en DMA.', noindex: true })

const { user } = useAuth()
const { isDark, toggle } = useTheme()
const toast = useToast()

const form = reactive({
  fullName: user.value?.fullName ?? '',
  email: user.value?.email ?? '',
  grade: '10°',
  reminders: true,
})

function save() {
  // Se conectará al endpoint de actualización de usuario
  user.value = { fullName: form.fullName, email: form.email }
  toast.success('Tus datos se guardaron.')
}
</script>
