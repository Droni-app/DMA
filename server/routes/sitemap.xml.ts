// Sitemap con las páginas públicas y el contenido real del backend (vía el bypass /api/appi)
export default defineEventHandler(async (event) => {
  const base = useRuntimeConfig().public.appUrl
  const list = (path: string) =>
    $fetch<{ data: { slug: string }[] }>(`/api/appi${path}?per_page=1000`)
      .then(res => res.data.map(item => item.slug))
      .catch(() => [] as string[])

  const [courses, posts, topics] = await Promise.all([list('/learn/courses'), list('/content/posts'), list('/social/topics')])
  const lessons = await Promise.all(courses.map(async course => (await list(`/learn/courses/${course}/lessons`)).map(lesson => `/cursos/${course}/${lesson}`)))

  const paths = [
    '/',
    '/cursos',
    '/blog',
    '/comunidad',
    ...courses.map(slug => `/cursos/${slug}`),
    ...lessons.flat(),
    ...posts.map(slug => `/blog/${slug}`),
    ...topics.map(slug => `/comunidad/${slug}`),
  ]

  setHeader(event, 'content-type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url><loc>${base}${path}</loc></url>`).join('\n')}
</urlset>`
})
