<template>
  <div>
    <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Bienvenido de nuevo</h1>
    <p class="mt-2 text-zinc-600 dark:text-zinc-400">Ingresa para continuar con tus cursos.</p>

    <div class="mt-8 space-y-6">
      <GoogleButton />
      <p class="flex items-center gap-3 text-sm text-zinc-500 before:h-px before:flex-1 before:bg-zinc-200 after:h-px after:flex-1 after:bg-zinc-200 dark:before:bg-zinc-800 dark:after:bg-zinc-800">
        o con tu correo
      </p>

      <DuiAlert v-if="error" color="danger" variant="outline">
        {{ error }}
        <button v-if="unverified" type="button" class="mt-2 block font-semibold underline" @click="resend">Reenviar correo de verificación</button>
      </DuiAlert>
      <DuiAlert v-if="sent" color="success" variant="outline">Te enviamos un nuevo correo de verificación.</DuiAlert>

      <DuiForm :loading="loading" @submit="submit">
        <DuiLabel title="Correo electrónico" required>
          <DuiInput v-model="email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required block />
        </DuiLabel>
        <DuiLabel title="Contraseña" required>
          <DuiInput v-model="password" type="password" autocomplete="current-password" placeholder="••••••••" required block />
        </DuiLabel>
        <template #footer>
          <DuiButton type="submit" color="primary" size="lg" block :loading="loading">Ingresar</DuiButton>
        </template>
      </DuiForm>

      <p class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tienes cuenta?
        <NuxtLink :to="{ path: '/registro', query: route.query }" class="font-semibold text-zinc-900 underline dark:text-white">Regístrate gratis</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeo({ title: 'Ingresar', description: 'Ingresa a tu cuenta de DMA para continuar con tus cursos.', noindex: true })

const route = useRoute()
const { login, sendVerification } = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const unverified = ref(false)
const sent = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  sent.value = false
  try {
    await login(email.value, password.value)
    await navigateTo(String(route.query.redirect ?? '/panel'))
  } catch (e: any) {
    error.value = apiError(e)
    unverified.value = (e?.data?.data?.message ?? '') === 'Email not verified.'
  } finally {
    loading.value = false
  }
}

async function resend() {
  await sendVerification(email.value).catch(() => {})
  error.value = ''
  sent.value = true
}
</script>
