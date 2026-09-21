export type SubjectType =
  | 'Computer Science'
  | 'Mathematics'
  | 'Biology & Medicine'
  | 'Physics & Chemistry'
  | 'Economics & Finance'
  | 'History & Humanities'
  | 'Psychology & Sociology'
  | 'Engineering'
  | 'Literature & Languages'
  | 'Law & Political Science'
  | 'Other';

export type DocCategory =
  | 'Lecture Notes'
  | 'Cheat Sheet'
  | 'Exam Prep'
  | 'Summary Sheet'
  | 'Lab Report'
  | 'Homework & Exercises'
  | 'Textbook Notes';

export type FileFormat = 'pdf' | 'image' | 'markdown' | 'text' | 'doc' | 'typed';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  courseCode?: string;
  category: DocCategory;
  format: FileFormat;
  fileName?: string;
  fileSize?: number; // bytes
  fileDataUrl?: string; // base64 or object URL for images/PDFs
  content: string; // text/markdown representation
  tags: string[];
  author: string;
  semester?: string;
  createdAt: string; // ISO date
  updatedAt: string;
  isFavorite: boolean;
  viewsCount: number;
  aiSummary?: string;
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'views';
export type ViewMode = 'grid' | 'list';

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'telegram'
  | 'website'
  | 'email'
  | 'other';

export interface OwnerSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
}

export interface OwnerProfile {
  name: string;
  title: string;
  bio: string;
  email: string;
  avatarUrl?: string;
  socials: OwnerSocialLink[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
