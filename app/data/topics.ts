// Datos de ejemplo con la forma de Topic / Reply de la API

export const topics = [
  {
    id: 't1',
    slug: 'no-entiendo-la-pendiente',
    name: '¿Alguien me explica la pendiente de una recta?',
    group: 'Matemáticas',
    content: 'Estoy en la lección de función lineal y no logro entender qué significa la pendiente ni cómo calcularla con dos puntos. ¿Algún truco?',
    author: 'Sofía G.',
    createdAt: '2026-10-10',
    replies: [
      { id: 'r1', author: 'Mateo L.', createdAt: '2026-10-10', content: 'Piensa en la pendiente como "cuánto sube la recta por cada paso a la derecha". Con dos puntos: (y2 − y1) / (x2 − x1).' },
      { id: 'r2', author: 'Prof. Camila', createdAt: '2026-10-11', content: '¡Muy buena explicación! Sofía, intenta graficar los puntos (1,2) y (3,6): sube 4 y avanza 2, entonces la pendiente es 2.' },
    ],
  },
  {
    id: 't2',
    slug: 'consejos-saber-11',
    name: 'Consejos para el día del Saber 11',
    group: 'Saber 11',
    content: 'Presento la prueba en un mes. ¿Qué recomiendan hacer el día anterior y durante el examen para manejar el tiempo?',
    author: 'Julián R.',
    createdAt: '2026-10-08',
    replies: [
      { id: 'r3', author: 'Valentina P.', createdAt: '2026-10-09', content: 'Duerme bien y no estudies temas nuevos el día antes. En la prueba, responde primero las que sabes y marca las difíciles para volver.' },
    ],
  },
  {
    id: 't3',
    slug: 'libros-recomendados',
    name: 'Libros cortos para practicar comprensión lectora',
    group: 'Lenguaje',
    content: 'Quiero leer más pero me aburren los libros muy largos. ¿Qué me recomiendan?',
    author: 'Mariana C.',
    createdAt: '2026-10-05',
    replies: [
      { id: 'r4', author: 'Tomás V.', createdAt: '2026-10-06', content: '"Crónica de una muerte anunciada" de García Márquez es corta y muy buena.' },
      { id: 'r5', author: 'Isabela M.', createdAt: '2026-10-06', content: 'Los cuentos de Horacio Quiroga, se leen en una sentada.' },
      { id: 'r6', author: 'Mariana C.', createdAt: '2026-10-07', content: '¡Gracias! Voy a empezar por esos.' },
    ],
  },
  {
    id: 't4',
    slug: 'grupo-de-estudio-quimica',
    name: 'Grupo de estudio de química 10°',
    group: 'Química',
    content: 'Estoy armando un grupo para repasar la tabla periódica los sábados. ¿Quién se apunta?',
    author: 'Samuel D.',
    createdAt: '2026-10-02',
    replies: [],
  },
]

export function getTopic(slug: string) {
  return topics.find(t => t.slug === slug)
}
