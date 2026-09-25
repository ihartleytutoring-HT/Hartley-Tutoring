export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string;
}

export interface Grade {
  id: string;
  name: string; // e.g. "Grade 12 (Matric)", "Grade 11", "Grade 10", "University Level"
  description?: string;
  order: number;
  active: boolean;
  createdAt?: string;
}

export interface Subject {
  id: string;
  gradeId: string;
  name: string; // "Mathematics", "Physical Sciences (Physics & Chemistry)", "Technical Maths"
  icon?: string;
  description?: string;
  order: number;
  createdAt?: string;
}

export interface Topic {
  id: string;
  gradeId: string;
  subjectId: string;
  title: string;
  description?: string;
  order: number;
  createdAt?: string;
}

export type LessonType = 'video' | 'notes' | 'quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LessonItem {
  id: string;
  topicId: string;
  gradeId: string;
  subjectId: string;
  title: string;
  type: LessonType;
  order: number;
  createdAt?: string;
  
  // Type: video
  videoUrl?: string; // YouTube URL or direct MP4/Vimeo
  videoDuration?: string;
  
  // Type: notes
  notesContent?: string; // Markdown or rich text
  notesAttachmentUrl?: string; // PDF or worksheet download
  
  // Type: quiz
  quizQuestions?: QuizQuestion[];
  passingScorePercent?: number; // Always 100% as requested
}

export interface PackagePrice {
  id: string; // e.g. "default" or `${gradeId}_${subjectId}`
  gradeId?: string;
  subjectId?: string;
  gradeName?: string;
  subjectName?: string;
  month1: number;  // Default R250
  month3: number;  // Default R600
  month6: number;  // Default R1000
  month12: number; // Default R1800
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  gradeId: string;
  gradeName: string;
  subjectId: string;
  subjectName: string;
  durationMonths: number;
  priceZar: number;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  paymentRef?: string;
  createdAt: string;
}

export interface UserProgress {
  id: string; // `${userId}_${lessonItemId}`
  userId: string;
  userEmail?: string;
  userName?: string;
  lessonItemId: string;
  topicId: string;
  gradeId: string;
  subjectId: string;
  type: LessonType;
  completed: boolean;
  score?: number; // e.g. 100
  passed?: boolean; // Requires 100% to pass
  attemptsCount?: number;
  lastScorePercent?: number;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade?: string;
  subject?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}
