// Tipos de la API (sources/api-1.json), solo con los campos que usa el front

export interface Paginated<T> {
  meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  data: T[]
}

export interface User {
  id: string
  fullName: string | null
  email: string
  avatar: string | null
}

export interface Course {
  id: string
  slug: string
  name: string
  group: string | null
  description: string | null
  picture: string | null
  video: string | null
  enrollment?: LearnEnrollment | null
}

export interface MyLearningCourse extends Course {
  enrollments: LearnEnrollment[]
}

export interface Lesson {
  id: string
  courseId: string
  slug: string
  name: string
  description: string | null
  format: string
  content: string | null
  activity: string | null
  video: string | null
  order: number
}

export interface Question {
  id: string
  name: string
  description: string | null
  response1: string
  response2: string
  response3: string | null
  response4: string | null
  response5: string | null
}

export interface LessonAnswer {
  id: string
  lessonId: string
  answer: string
  feedback: string | null
  result: string | null
}

export interface LessonQuiz {
  id: string
  lessonId: string
  status: string
  results: string | null
}

export interface LearnEnrollment {
  id: string
  progress: string
  status: string
  role?: string
  lessonAnswers?: LessonAnswer[]
  quizzes?: LessonQuiz[]
}

// GET /learn/courses/{course}/lessons/{lesson}
export interface LessonDetail extends Lesson {
  myAnswer: LessonAnswer | null
  myQuiz: LessonQuiz | null
  quizQuestions: (Question | { question: Question })[]
}

export interface Post {
  id: string
  slug: string
  name: string
  description: string | null
  tags: string[] | null
  picture: string | null
  content: string | null
  createdAt: string
  user?: User
}

export interface Topic {
  id: string
  slug: string
  name: string
  group: string | null
  content: string
  createdAt: string
  user?: User
}

export interface Reply {
  id: string
  content: string
  createdAt: string
  user?: User
}
