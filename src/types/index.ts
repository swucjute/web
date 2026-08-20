export type UserRole = 'admin' | 'leader' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  birthDate: string;
  joinDate: string;
  department: string;
  position?: string;
  bank?: string;
  accountNumber?: string;
  isActive: boolean;
  isPending?: boolean;
  /** 'kakao'면 실제 백엔드 로그인 사용자 (department 값이 백엔드 enum이라 '청년부' 문자열과 다름 — 소속 체크 시 참고) */
  authSource?: 'mock' | 'kakao';
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
  type?: 'notice' | 'recruit';
  category?: '예배' | '공지' | '전도' | '행사';
  date?: string;
  location?: string;
  chatLink?: string;
  maxParticipants?: string;
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

export interface WorshipPraise {
  id: string;
  title: string;
  artist: string;
  youtubeUrl?: string;
}

export interface Worship {
  id: string;
  date: string;
  title: string;
  preacher: string;
  scripture: string;
  scriptureText?: string;
  sermonTitle: string;
  attendance: number;
  worshipLeader: string;
  praiseList: string[];
  offerings: number;
  notes: string;
  youtubeUrl?: string;
  bulletinImages?: string[];
  committee?: {
    repPrayer?: string;    // 대표기도
    bibleReading?: string; // 말씀봉독
    offering?: string;     // 봉헌위원
  };
  announcements?: {
    id: string;
    title: string;
    description: string;
    surveyId?: string;
  }[];
  inlinePraises?: WorshipPraise[];
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
  worshipId?: string;
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

export type PlatformLifecycle = 'pending' | 'active';
export type PlatformActiveState = 'recruiting' | 'operating' | 'ended';

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
  scheduledDate: string;          // 일시
  location: string;               // 장소
  content: string;                // 내용
  purpose: string;                // 목적
  other: string;                  // 기타
  posterUrl?: string;             // base64 or URL
  lifecycle: PlatformLifecycle;   // pending(승인대기), active(활성)
  activeStates: PlatformActiveState[]; // recruiting, operating, ended — 동시 가능
  proposedBy: string;             // userId
  proposedByName: string;
  participants: string[];         // userIds (승인된 참여자)
  pendingParticipants?: string[]; // userIds (참여 신청 대기중)
  createdAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}