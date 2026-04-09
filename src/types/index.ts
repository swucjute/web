export type UserRole = 'admin' | 'leader' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  birthDate: string;
  joinDate: string;
  department: string;
  position?: string;
  bank?: string;
  accountNumber?: string;
  isActive: boolean;
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  comments: Comment[];
  likes: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'worship' | 'meeting' | 'event' | 'other';
  createdBy: string;
}

export interface Worship {
  id: string;
  date: string;
  title: string;
  preacher: string;
  scripture: string;
  sermonTitle: string;
  attendance: number;
  worshipLeader: string;
  praiseList: string[];
  offerings: number;
  notes: string;
}

export interface Praise {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: string;
  lyrics?: string;
  youtubeUrl?: string;
  category: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  createdBy: string;
  createdAt: string;
  deadline: string;
  isActive: boolean;
  responses: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'multiple';
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  userId: string;
  userName: string;
  answers: { [questionId: string]: string | string[] };
  submittedAt: string;
}

export type PlatformStatus = 'pending' | 'recruiting' | 'operating' | 'ended';

export interface Prayer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  isAnswered: boolean;
  reactions: string[];
  createdAt: string;
}

export interface Platform {
  id: string;
  title: string;
  scheduledDate: string;   // 일시
  content: string;         // 내용
  purpose: string;         // 목적
  other: string;           // 기타
  posterUrl?: string;      // base64 or URL
  status: PlatformStatus;
  proposedBy: string;      // userId
  proposedByName: string;
  participants: string[];  // userIds
  createdAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}