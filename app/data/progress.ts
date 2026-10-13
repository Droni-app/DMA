import { courses } from './courses'

// Progreso simulado del estudiante (en la API viene de las inscripciones y vistas de lecciones)
export const myCourses = [
  { course: courses[0]!, completed: 4 },
  { course: courses[2]!, completed: 2 },
  { course: courses[8]!, completed: 1 },
  { course: courses[5]!, completed: 5 },
].map(({ course, completed }) => ({
  course,
  completed,
  progress: Math.round((completed / course.lessons.length) * 100),
  next: course.lessons[Math.min(completed, course.lessons.length - 1)]!,
}))
