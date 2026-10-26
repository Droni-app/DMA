import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      titleTemplate: '%s · DMA',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#18181b', media: '(prefers-color-scheme: dark)' },
        { property: 'og:site_name', content: 'DMA · Droni.co Modern Academy' },
        { property: 'og:locale', content: 'es_CO' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
      ],
    },
  },
  runtimeConfig: {
    appi: process.env.APPI,
    appiSiteId: process.env.APPI_SITE_ID,
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },
  gtag: {
    id: 'G-XW9V1Z4NMQ'
  }
})
