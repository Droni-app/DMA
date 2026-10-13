import type { User } from '~/types/api'

// Sesión contra el backend. El token se guarda en la cookie que el bypass /api/appi envía como Bearer.
export function useAuth() {
  const token = useCookie<string | null>('appi_session_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: !import.meta.dev,
  })
  const user = useState<User | null>('user', () => null)
  const requestFetch = useRequestFetch()

  async function fetchUser() {
    if (!token.value) return (user.value = null)
    try {
      const res = await requestFetch<{ user: User }>('/api/appi/auth/me')
      user.value = res.user
    } catch {
      user.value = null
      token.value = null
    }
  }

  function setSession(res: { token: string; user: User }) {
    token.value = res.token
    user.value = res.user
  }

  async function login(email: string, password: string) {
    setSession(await apiFetch<{ token: string; user: User }>('/auth/login', { method: 'POST', body: { email, password } }))
  }

  // El backend pide verificar el correo antes del primer ingreso
  async function register(fullName: string, email: string, password: string, passwordConfirmation: string) {
    await apiFetch('/auth/register', { method: 'POST', body: { fullName, email, password, passwordConfirmation } })
  }

  async function sendVerification(email: string) {
    await apiFetch('/auth/send-verification-email', { method: 'POST', body: { email } })
  }

  async function loginWithGoogle() {
    const { url } = await apiFetch<{ url: string }>('/auth/google/url')
    window.location.href = url
  }

  async function logout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    token.value = null
    user.value = null
    await navigateTo('/')
  }

  return { user, fetchUser, setSession, login, register, sendVerification, loginWithGoogle, logout }
}
