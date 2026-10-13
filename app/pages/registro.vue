<template>
  <div>
    <!-- Cuenta creada: falta verificar el correo -->
    <div v-if="registered" class="text-center">
      <span class="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <i class="mdi mdi-email-check-outline text-3xl" aria-hidden="true" />
      </span>
      <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Revisa tu correo</h1>
      <p class="mt-3 text-zinc-600 dark:text-zinc-400">
        Enviamos un enlace de verificación a <strong class="text-zinc-900 dark:text-white">{{ form.email }}</strong>. Ábrelo para activar tu cuenta y luego ingresa.
      </p>
      <DuiAction :to="{ path: '/login', query: route.query }" color="primary" size="lg" block class="mt-8">Ir a ingresar</DuiAction>
      <DuiButton variant="ghost" color="neutral" class="mt-3" :disabled="sent" @click="resend">
        {{ sent ? 'Correo reenviado' : '¿No llegó? Reenviar correo' }}
      </DuiButton>
    </div>

    <template v-else>
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Crea tu cuenta gratis</h1>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">Empieza a reforzar tus materias hoy mismo.</p>

      <div class="mt-8 space-y-6">
        <GoogleButton />
        <p class="flex items-center gap-3 text-sm text-zinc-500 before:h-px before:flex-1 before:bg-zinc-200 after:h-px after:flex-1 after:bg-zinc-200 dark:before:bg-zinc-800 dark:after:bg-zinc-800">
          o con tu correo
        </p>

        <DuiAlert v-if="error" color="danger" variant="outline">{{ error }}</DuiAlert>

        <DuiForm :loading="loading" @submit="submit">
          <DuiLabel title="Nombre completo" required>
            <DuiInput v-model="form.fullName" autocomplete="name" placeholder="Tu nombre" required block />
          </DuiLabel>
          <DuiLabel title="Correo electrónico" required>
            <DuiInput v-model="form.email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required block />
          </DuiLabel>
          <DuiLabel title="Contraseña" help-text="Mínimo 8 caracteres." required>
            <DuiInput v-model="form.password" type="password" autocomplete="new-password" minlength="8" required block />
          </DuiLabel>
          <DuiLabel title="Confirmar contraseña" required>
            <DuiInput v-model="form.passwordConfirmation" type="password" autocomplete="new-password" required block />
          </DuiLabel>
          <DuiCheckbox v-model="form.terms" label="Acepto los términos y la política de privacidad" />
          <template #footer>
            <DuiButton type="submit" color="primary" size="lg" block :loading="loading">Crear cuenta</DuiButton>
          </template>
        </DuiForm>

        <p class="text-center text-sm text-zinc-600 dark:text-zinc-400">
          ¿Ya tienes cuenta?
          <NuxtLink :to="{ path: '/login', query: route.query }" class="font-semibold text-zinc-900 underline dark:text-white">Ingresa</NuxtLink>
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeo({ title: 'Crear cuenta', description: 'Crea tu cuenta gratis en DMA y accede a cursos de refuerzo para bachillerato.', noindex: true })

const route = useRoute()
const { register, sendVerification } = useAuth()
const loading = ref(false)
const error = ref('')
const registered = ref(false)
const sent = ref(false)

const form = reactive({ fullName: '', email: '', password: '', passwordConfirmation: '', terms: false })

async function submit() {
  error.value = ''
  if (form.password !== form.passwordConfirmation) return (error.value = 'Las contraseñas no coinciden.')
  if (!form.terms) return (error.value = 'Debes aceptar los términos para continuar.')

  loading.value = true
  try {
    await register(form.fullName, form.email, form.password, form.passwordConfirmation)
    registered.value = true
  } catch (e) {
    error.value = apiError(e, 'No pudimos crear tu cuenta. Intenta de nuevo.')
  } finally {
    loading.value = false
  }
}

async function resend() {
  await sendVerification(form.email).catch(() => {})
  sent.value = true
}
</script>
