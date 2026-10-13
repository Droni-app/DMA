export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.appUrl
  setHeader(event, 'content-type', 'text/plain')
  return `User-agent: *
Allow: /
Disallow: /panel
Disallow: /api

Sitemap: ${base}/sitemap.xml
`
})
