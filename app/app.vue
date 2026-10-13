<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly><DuiToast position="top-right" /></ClientOnly>
</template>

<script setup lang="ts">
const { isDark } = useTheme()
const appUrl = useRuntimeConfig().public.appUrl

useHead({
  htmlAttrs: { class: computed(() => (isDark.value ? 'dark' : '')) },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'DMA · Droni.co Modern Academy',
        url: appUrl,
        logo: `${appUrl}/favicon.ico`,
        description: 'Plataforma de educación virtual para reforzar el bachillerato: cursos de 6° a 11° y preparación Saber 11.',
      }),
    },
  ],
})
</script>
