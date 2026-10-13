// Datos de ejemplo. Siguen la forma de Course / Lesson / Question de la API
// para que conectar el backend sea solo cambiar el origen de los datos.

export const subjects = [
  { slug: 'matematicas', name: 'Matemáticas', icon: 'mdi mdi-calculator-variant-outline', cover: 'from-sky-500 to-indigo-600' },
  { slug: 'lenguaje', name: 'Lenguaje', icon: 'mdi mdi-book-open-page-variant-outline', cover: 'from-rose-500 to-pink-600' },
  { slug: 'ciencias', name: 'Ciencias Naturales', icon: 'mdi mdi-leaf', cover: 'from-emerald-500 to-teal-600' },
  { slug: 'sociales', name: 'Ciencias Sociales', icon: 'mdi mdi-earth', cover: 'from-amber-500 to-orange-600' },
  { slug: 'ingles', name: 'Inglés', icon: 'mdi mdi-translate', cover: 'from-violet-500 to-purple-600' },
  { slug: 'fisica', name: 'Física', icon: 'mdi mdi-atom', cover: 'from-cyan-500 to-blue-600' },
  { slug: 'quimica', name: 'Química', icon: 'mdi mdi-flask-outline', cover: 'from-lime-500 to-green-600' },
  { slug: 'saber-11', name: 'Preparación Saber 11', icon: 'mdi mdi-school-outline', cover: 'from-slate-600 to-zinc-800' },
]

export const grades = ['6°', '7°', '8°', '9°', '10°', '11°']

const sampleContent = `
<p>En esta lección vamos a construir la idea paso a paso, con ejemplos cotidianos y ejercicios cortos para que compruebes lo que aprendes.</p>
<h2>¿Qué vas a aprender?</h2>
<ul>
  <li>El concepto principal y por qué es importante.</li>
  <li>Cómo reconocerlo en problemas reales.</li>
  <li>Los errores más comunes y cómo evitarlos.</li>
</ul>
<h2>Explicación</h2>
<p>Piensa en una situación de tu día a día: repartir una pizza entre amigos, calcular cuánto tardas en llegar al colegio o comparar precios en la tienda. Detrás de cada una hay una idea que podemos describir con precisión.</p>
<blockquote>Consejo: lee el ejemplo dos veces antes de intentar el ejercicio. Entender el porqué vale más que memorizar el cómo.</blockquote>
<h3>Ejemplo resuelto</h3>
<p>Si un bus recorre <strong>60 km en 1 hora</strong>, en media hora recorre la mitad: <code>60 ÷ 2 = 30 km</code>. La relación entre tiempo y distancia se mantiene constante; eso es lo que llamamos <strong>proporcionalidad directa</strong>.</p>
<h2>Para recordar</h2>
<p>Cuando dos cantidades crecen o decrecen al mismo ritmo, su cociente es siempre el mismo. Usa esa constante para encontrar el valor que falta.</p>
`

function lessons(courseId: string, names: string[]) {
  return names.map((name, i) => ({
    id: `${courseId}-l${i + 1}`,
    courseId,
    slug: `leccion-${i + 1}`,
    name,
    order: i + 1,
    format: i % 3 === 2 ? 'video' : 'text',
    description: 'Explicación clara con ejemplos y un ejercicio corto al final.',
    duration: 10 + ((i * 7) % 15),
    content: sampleContent,
  }))
}

export const courses = [
  {
    id: 'c1',
    slug: 'algebra-desde-cero',
    name: 'Álgebra desde cero',
    subject: 'matematicas',
    grade: '8°',
    level: 'Básico',
    description: 'Variables, expresiones y ecuaciones explicadas paso a paso, con ejercicios que se corrigen solos.',
    students: 1240,
    rating: 4.8,
    lessons: lessons('c1', ['¿Qué es una variable?', 'Expresiones algebraicas', 'Términos semejantes', 'Ecuaciones de primer grado', 'Problemas con ecuaciones', 'Repaso final']),
  },
  {
    id: 'c2',
    slug: 'funciones-y-graficas',
    name: 'Funciones y gráficas',
    subject: 'matematicas',
    grade: '9°',
    level: 'Intermedio',
    description: 'Aprende a leer, construir e interpretar funciones lineales y cuadráticas en el plano cartesiano.',
    students: 860,
    rating: 4.7,
    lessons: lessons('c2', ['El plano cartesiano', 'Concepto de función', 'Función lineal', 'Pendiente e intercepto', 'Función cuadrática']),
  },
  {
    id: 'c3',
    slug: 'comprension-lectora',
    name: 'Comprensión lectora crítica',
    subject: 'lenguaje',
    grade: '10°',
    level: 'Intermedio',
    description: 'Estrategias para entender, inferir y argumentar a partir de textos literarios e informativos.',
    students: 1530,
    rating: 4.9,
    lessons: lessons('c3', ['Tipos de texto', 'Idea principal y secundarias', 'Inferencias', 'Intención del autor', 'Textos argumentativos']),
  },
  {
    id: 'c4',
    slug: 'la-celula',
    name: 'La célula y sus funciones',
    subject: 'ciencias',
    grade: '6°',
    level: 'Básico',
    description: 'Descubre cómo funciona la unidad básica de la vida, sus partes y los procesos que la mantienen activa.',
    students: 720,
    rating: 4.6,
    lessons: lessons('c4', ['¿Qué es una célula?', 'Célula animal y vegetal', 'Organelos', 'Nutrición celular']),
  },
  {
    id: 'c5',
    slug: 'historia-de-colombia',
    name: 'Historia de Colombia',
    subject: 'sociales',
    grade: '9°',
    level: 'Intermedio',
    description: 'Un recorrido desde la Independencia hasta la Constitución de 1991, con líneas de tiempo y fuentes.',
    students: 640,
    rating: 4.7,
    lessons: lessons('c5', ['La Independencia', 'La Gran Colombia', 'El siglo XIX', 'El siglo XX', 'Constitución de 1991']),
  },
  {
    id: 'c6',
    slug: 'ingles-b1',
    name: 'Inglés intermedio B1',
    subject: 'ingles',
    grade: '10°',
    level: 'Intermedio',
    description: 'Gramática, vocabulario y lectura para comunicarte con seguridad y prepararte para pruebas.',
    students: 1980,
    rating: 4.8,
    lessons: lessons('c6', ['Present perfect', 'Past continuous', 'Conditionals', 'Reading strategies', 'Writing an email']),
  },
  {
    id: 'c7',
    slug: 'cinematica',
    name: 'Cinemática: el movimiento',
    subject: 'fisica',
    grade: '10°',
    level: 'Intermedio',
    description: 'Velocidad, aceleración y caída libre con simulaciones y problemas tipo examen.',
    students: 530,
    rating: 4.5,
    lessons: lessons('c7', ['Posición y desplazamiento', 'Velocidad', 'Aceleración', 'Movimiento uniformemente acelerado', 'Caída libre']),
  },
  {
    id: 'c8',
    slug: 'tabla-periodica',
    name: 'La tabla periódica',
    subject: 'quimica',
    grade: '10°',
    level: 'Básico',
    description: 'Entiende la organización de los elementos y sus propiedades sin memorizar de más.',
    students: 610,
    rating: 4.6,
    lessons: lessons('c8', ['Historia de la tabla', 'Grupos y periodos', 'Propiedades periódicas', 'Metales y no metales']),
  },
  {
    id: 'c9',
    slug: 'simulacro-saber-11',
    name: 'Simulacro Saber 11',
    subject: 'saber-11',
    grade: '11°',
    level: 'Avanzado',
    description: 'Preguntas reales tipo ICFES por área, con explicación de cada respuesta y estrategias de tiempo.',
    students: 3210,
    rating: 4.9,
    lessons: lessons('c9', ['Cómo funciona la prueba', 'Lectura crítica', 'Matemáticas', 'Sociales y ciudadanas', 'Ciencias naturales', 'Inglés']),
  },
]

// Preguntas tipo quiz (forma de Question en la API)
export const questions = [
  {
    id: 'q1',
    name: 'Si 3 cuadernos cuestan $9.000, ¿cuánto cuestan 5 cuadernos?',
    response1: '$12.000',
    response2: '$15.000',
    response3: '$18.000',
    response4: '$45.000',
    responseCorrect: 2,
  },
  {
    id: 'q2',
    name: '¿Cuál de estas relaciones es de proporcionalidad directa?',
    response1: 'Velocidad y tiempo de un viaje',
    response2: 'Número de obreros y días de trabajo',
    response3: 'Cantidad de kilos y precio a pagar',
    response4: 'Ninguna de las anteriores',
    responseCorrect: 3,
  },
  {
    id: 'q3',
    name: 'Un bus recorre 60 km en 1 hora. ¿Cuántos km recorre en 2,5 horas?',
    response1: '120 km',
    response2: '150 km',
    response3: '180 km',
    response4: '90 km',
    responseCorrect: 2,
  },
]

export function getSubject(slug: string) {
  return subjects.find(s => s.slug === slug)!
}

export function getCourse(slug: string) {
  return courses.find(c => c.slug === slug)
}

export type Course = (typeof courses)[number]
