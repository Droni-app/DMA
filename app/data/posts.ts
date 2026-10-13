// Datos de ejemplo con la forma de Post de la API

const body = `
<p>Estudiar no es pasar horas frente al cuaderno: es usar bien el tiempo. Estas ideas, respaldadas por la investigación sobre cómo aprende el cerebro, te ayudarán a rendir más con menos esfuerzo.</p>
<h2>1. Repasa en intervalos</h2>
<p>En lugar de estudiar todo la noche anterior, divide el tema en sesiones cortas durante varios días. Cada repaso fortalece la memoria y reduce el olvido.</p>
<h2>2. Ponte a prueba</h2>
<p>Responder preguntas sin mirar los apuntes es una de las formas más efectivas de aprender. Por eso cada lección en DMA termina con un quiz corto.</p>
<blockquote>Equivocarte en un quiz de práctica no es un fracaso: es la mejor señal de qué necesitas repasar.</blockquote>
<h2>3. Explícalo con tus palabras</h2>
<p>Si puedes explicarle un tema a un amigo, lo entendiste. Si no, ya sabes dónde enfocarte. La comunidad de DMA es un buen lugar para practicarlo.</p>
<h2>4. Cuida tu descanso</h2>
<p>Dormir bien consolida lo que aprendiste durante el día. Un buen descanso vale más que una hora extra de estudio a medianoche.</p>
`

export const posts = [
  {
    id: 'p1',
    slug: 'tecnicas-de-estudio-que-si-funcionan',
    name: '4 técnicas de estudio que sí funcionan',
    description: 'Lo que dice la ciencia sobre cómo aprender mejor y recordar por más tiempo.',
    tags: 'Hábitos',
    author: 'Laura Méndez',
    createdAt: '2026-09-28',
    readingTime: 5,
    content: body,
  },
  {
    id: 'p2',
    slug: 'como-prepararte-para-el-saber-11',
    name: 'Cómo prepararte para el Saber 11 en 3 meses',
    description: 'Un plan semana a semana para llegar tranquilo y con confianza a la prueba.',
    tags: 'Saber 11',
    author: 'Andrés Rojas',
    createdAt: '2026-09-15',
    readingTime: 8,
    content: body,
  },
  {
    id: 'p3',
    slug: 'perderle-el-miedo-a-las-matematicas',
    name: 'Perderle el miedo a las matemáticas',
    description: 'Las matemáticas se aprenden practicando. Te contamos cómo empezar sin frustrarte.',
    tags: 'Matemáticas',
    author: 'Camila Torres',
    createdAt: '2026-09-02',
    readingTime: 6,
    content: body,
  },
  {
    id: 'p4',
    slug: 'leer-mejor-en-ingles',
    name: 'Trucos para leer mejor en inglés',
    description: 'Cómo entender textos en inglés sin traducir palabra por palabra.',
    tags: 'Inglés',
    author: 'Daniel Pérez',
    createdAt: '2026-08-20',
    readingTime: 4,
    content: body,
  },
]

export function getPost(slug: string) {
  return posts.find(p => p.slug === slug)
}
