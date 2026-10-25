// Tipos de la API (https://droni.co/proyectos/appi), solo con los campos que usa el front.
// Los booleanos llegan a veces como 1/0: se leen con isTrue().

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

export type CourseRole = 'student' | 'teacher' | 'admin'
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'canceled'

export interface Course {
  id: string
  slug: string
  name: string
  group: string | null
  description: string | null
  picture: string | null
  video: string | null
  autoEnroll?: boolean | number
  active?: boolean | number
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
  active?: boolean | number | string
  limitDate?: string | null
}

export interface CompletedLesson extends Omit<Lesson, 'courseId'> {
  course: Pick<Course, 'id' | 'slug' | 'name' | 'group'>
}

export interface Question {
  id: string
  name: string
  description?: string | null
  picture?: string | null
  attachment?: string | null
  response1?: string
  response2?: string
  response3?: string | null
  response4?: string | null
  response5?: string | null
  response_1?: string
  response_2?: string
  response_3?: string | null
  response_4?: string | null
  response_5?: string | null
  responseCorrect?: number | string
  response_correct?: number | string
  wons?: number | string
  losses?: number | string
  difficulty?: number | string
}

export interface LessonQuestionLink {
  id: string
  lessonId: string
  questionId: string
  question: Question
}

export interface LessonAnswer {
  id: string
  lessonId: string
  userId?: string
  answer: string
  attachment?: string | null
  feedback: string | null
  result: string | number | null
  createdAt?: string
  user?: User
}

export interface LessonQuiz {
  id: string
  lessonId: string
  userId?: string
  status: string
  results: string | number | null
  // JSON serializado: [{ question_id, selected, correct }]
  answers?: string | null
  createdAt?: string
  user?: User
}

export interface LearnEnrollment {
  id: string
  courseId?: string
  userId?: string
  progress: string | number
  status: EnrollmentStatus | string
  role?: CourseRole | string
  createdAt?: string
  user?: User
  course?: Course
  lessonAnswers?: LessonAnswer[]
  quizzes?: LessonQuiz[]
}

// GET /learn/courses/{course}/lessons/{lesson}
export interface LessonDetail extends Lesson {
  myAnswer: LessonAnswer | null
  myQuiz: LessonQuiz | null
  quizQuestions: (Question | { question: Question })[]
}

export interface Attachment {
  id: string
  name: string
  size: number
  mime: string
  url: string
  createdAt: string
}

export interface Post {
  id: string
  slug: string
  name: string
  description: string | null
  tags: string[] | null
  picture: string | null
  content: string | null
  format?: string
  active?: boolean | number
  createdAt: string
  user?: User
}

export interface Comment {
  id: string
  content: string
  parentId: string | null
  isEdited?: boolean
  active?: boolean | number
  createdAt: string
  commentableId?: string
  user?: User
  children?: Comment[]
}

export interface Topic {
  id: string
  slug: string
  name: string
  group: string | null
  content: string
  active?: boolean | number
  createdAt: string
  user?: User
}

export interface Reply {
  id: string
  content: string
  createdAt: string
  user?: User
}
