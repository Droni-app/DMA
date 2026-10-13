import { courses } from '../../app/data/courses'
import { posts } from '../../app/data/posts'
import { topics } from '../../app/data/topics'

export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.appUrl
  const paths = [
    '/',
    '/cursos',
    '/blog',
    '/comunidad',
    ...courses.map(c => `/cursos/${c.slug}`),
    ...posts.map(p => `/blog/${p.slug}`),
    ...topics.map(t => `/comunidad/${t.slug}`),
  ]

  setHeader(event, 'content-type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url><loc>${base}${path}</loc></url>`).join('\n')}
</urlset>`
})
