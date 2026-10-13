// Sesión simulada. En el paso del backend se reemplaza por /auth/login, /auth/register, /auth/me y /auth/logout.
interface DemoUser {
  fullName: string
  email: string
}

export function useAuth() {
  const user = useCookie<DemoUser | null>('dma_demo_user', { default: () => null })

  async function login(email: string, _password: string) {
    user.value = { fullName: 'Estudiante DMA', email }
  }

  async function register(fullName: string, email: string, _password: string) {
    user.value = { fullName, email }
  }

  async function logout() {
    user.value = null
    await navigateTo('/')
  }

  return { user, login, register, logout }
}
