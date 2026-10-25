// Solo el owner del sitio entra a /panel/admin
export default defineNuxtRouteMiddleware((to) => {
  const { user, isOwner } = useAuth()
  if (!user.value) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  if (!isOwner.value) return navigateTo('/panel')
})
