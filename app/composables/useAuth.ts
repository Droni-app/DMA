import type { User } from '~/types/api'

interface Session {
  token?: string
  user: User
  enrollment?: { id: string; role: string } | null
}

// Sesión contra el backend. El token se guarda en la cookie que el bypass /api/appi envía como Bearer.
export function useAuth() {
  const token = useCookie<string | null>('appi_session_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: !import.meta.dev,
  })
  const user = useState<User | null>('user', () => null)
  // Rol en el sitio: 'user' u 'owner' (el owner administra cursos, blog y comunidad)
  const siteRole = useState<string | null>('site-role', () => null)
  const isOwner = computed(() => siteRole.value === 'owner')
  const requestFetch = useRequestFetch()

  async function fetchUser() {
    if (!token.value) return (user.value = null)
    try {
      setSession(await requestFetch<Session>('/api/appi/auth/me'))
    } catch {
      clearSession()
    }
  }

  function setSession(res: Session) {
    if (res.token) token.value = res.token
    user.value = res.user
    siteRole.value = res.enrollment?.role ?? null
  }

  function clearSession() {
    token.value = null
    user.value = null
    siteRole.value = null
  }

  async function login(email: string, password: string) {
    setSession(await apiFetch<Session>('/auth/login', { method: 'POST', body: { email, password } }))
  }

  // El backend pide verificar el correo antes del primer ingreso
  async function register(fullName: string, email: string, password: string, passwordConfirmation: string) {
    await apiFetch('/auth/register', { method: 'POST', body: { fullName, email, password, passwordConfirmation } })
  }

  async function sendVerification(email: string) {
    await apiFetch('/auth/send-verification-email', { method: 'POST', body: { email } })
  }

  function googleCallbackUrl() {
    const config = useRuntimeConfig()
    return new URL('/oauth/google/callback', config.public.appUrl).toString()
  }

  // La página a la que volver se guarda mientras el usuario pasa por Google
  async function loginWithGoogle(redirect?: string) {
    const { url } = await apiFetch<{ url: string }>('/auth/google/url', {
      query: { callbackUrl: googleCallbackUrl() },
    })
    if (redirect) sessionStorage.setItem('login-redirect', redirect)
    window.location.href = url
  }

  async function handleGoogleCallback(code: string) {
    const session = await apiFetch<Session>('/auth/google/handle', {
      query: {
        code,
        callbackUrl: googleCallbackUrl(),
      },
    })
    setSession(session)
  }

  async function logout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    clearSession()
    await navigateTo('/')
  }

  return { user, isOwner, fetchUser, setSession, login, register, sendVerification, loginWithGoogle, handleGoogleCallback, logout }
}
