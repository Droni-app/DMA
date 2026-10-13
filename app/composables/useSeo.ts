// Meta etiquetas SEO comunes para cada página
interface SeoOptions {
  title: string
  description: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export function useSeo({ title, description, type = 'website', noindex = false }: SeoOptions) {
  const route = useRoute()
  const url = useRuntimeConfig().public.appUrl + route.path
  const image = useRuntimeConfig().public.appUrl + '/og.png'

  useSeoMeta({
    title,
    description,
    ogTitle: `${title} · DMA`,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogImage: image,
    twitterTitle: `${title} · DMA`,
    twitterDescription: description,
    twitterImage: image,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })
}
