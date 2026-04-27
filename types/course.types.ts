export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  _count?: {
    courses: number;
  };
};

export type CourseLesson = {
  id: string;
  title: string;
  type: 'VIDEO' | 'LIVE' | 'QUIZ' | 'ASSIGNMENT' | 'FILE';
  duration: string | null;
  videoUrl: string | null;
  isFree: boolean;
  order: number;
  courseId: string;
  createdAt?: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  rating: number;
  students: number;
  categoryId: string;
  category: CourseCategory;
  lessons: CourseLesson[];
  createdAt?: string;
  updatedAt?: string;
};

export type CourseQuery = {
  search?: string;
  category?: string;
};

export type CourseCardData = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  progress: number;
  lessonsLeft: number;
};
