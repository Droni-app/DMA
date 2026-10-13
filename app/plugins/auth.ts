// Carga el usuario de la sesión al iniciar (en el servidor y, si hace falta, en el navegador)
export default defineNuxtPlugin(async () => {
  const { user, fetchUser } = useAuth()
  if (!user.value) await fetchUser()
})
