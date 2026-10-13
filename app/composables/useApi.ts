import type { UseFetchOptions } from 'nuxt/app'

// Todas las peticiones pasan por el bypass /api/appi, que agrega el site id y el token de sesión.

// Lecturas: funciona en SSR y reenvía las cookies de la sesión
export function useApi<T>(path: string | (() => string), options: UseFetchOptions<T> = {}) {
  return useFetch(() => `/api/appi${toValue(path)}`, options as any) as ReturnType<typeof useFetch<T>>
}

// Acciones (POST, PUT, DELETE) desde el navegador
export function apiFetch<T>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
  return $fetch<T>(`/api/appi${path}`, options)
}

// Mensaje de error legible a partir de la respuesta del backend
const messages: Record<string, string> = {
  'Invalid user credentials': 'Correo o contraseña incorrectos.',
  'Email not verified.': 'Debes verificar tu correo antes de ingresar. Revisa tu bandeja de entrada.',
  'Unauthorized access': 'Tu sesión expiró. Ingresa de nuevo.',
}

export function apiError(error: any, fallback = 'Algo salió mal. Intenta de nuevo.') {
  const data = error?.data?.data ?? error?.data
  const message = data?.errors?.[0]?.message ?? data?.message
  return messages[message] ?? message ?? fallback
}
