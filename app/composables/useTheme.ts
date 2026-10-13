// Tema claro/oscuro guardado en cookie para que el SSR pinte el tema correcto sin parpadeo
export function useTheme() {
  const theme = useCookie<'light' | 'dark'>('theme', { default: () => 'light', maxAge: 60 * 60 * 24 * 365 })
  const isDark = computed(() => theme.value === 'dark')

  function toggle() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  return { isDark, toggle }
}
