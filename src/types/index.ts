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

// --- Platform (백엔드 도메인 모양 그대로) ---
// 백엔드는 approvalStatus(승인여부)와 operatingStatus(운영상태)를 각각 하나의 값만 가진다.
// (예전 프론트는 여러 상태를 배열로 동시에 가질 수 있게 설계됐었는데, 실제 백엔드 기준으로 단순화했다.)
export type PlatformApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PlatformOperatingStatus = 'RECRUITING' | 'ACTIVE' | 'CLOSED' | 'FINISHED' | 'CANCELLED';
export type PlatformMemberRole = 'OWNER' | 'MANAGER' | 'MEMBER';
export type PlatformMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

// 백엔드 목록/페이지 API 공통 응답 모양
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Platform {
  id: string;                     // String(platformId) — 프론트 공용 훅이 문자열 id를 요구해서 추가한 필드
  platformId: number;
  title: string;
  scheduleText: string | null;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
  posterUrl: string | null;
  approvalStatus: PlatformApprovalStatus;
  operatingStatus: PlatformOperatingStatus;
  approvedMemberCount: number;
  ownerMemberId: number;
  ownerName: string | null;
  createdAt: string;
  content?: string | null;        // 목록 응답엔 없고 상세 응답에만 있음
  purpose?: string | null;
  etc?: string | null;
  updatedAt?: string;
}

// 플랫폼 생성/수정 요청 바디 (백엔드 PlatformSaveRequest와 동일)
export interface PlatformSaveRequest {
  title: string;
  scheduleText?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  location?: string | null;
  content?: string | null;
  purpose?: string | null;
  etc?: string | null;
  posterUrl?: string | null;
  operatingStatus?: PlatformOperatingStatus;
}

export interface PlatformMember {
  platformMemberId: number;
  platformId: number;
  memberId: number;
  memberName: string | null;
  role: PlatformMemberRole;
  status: PlatformMemberStatus;
  requestedAt: string;
  approvedAt: string | null;
  rejectedReason: string | null;
}