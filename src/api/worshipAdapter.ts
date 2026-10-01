import type {
  WorshipDetailResponse,
  WorshipListItemResponse,
  WorshipSaveRequest,
} from './model';
import type { Worship } from '../types';

function datePart(value?: string): string {
  return value?.slice(0, 10) ?? '';
}

function youtubeUrl(videoId?: string): string | undefined {
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined;
}

function youtubeVideoId(url?: string): string | undefined {
  if (!url) return undefined;
  return url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/)?.[1];
}

export function worshipListItemToView(item: WorshipListItemResponse): Worship {
  return {
    id: String(item.id ?? ''),
    date: datePart(item.worshipAt),
    title: '예배',
    preacher: item.preacherName ?? '',
    scripture: '',
    sermonTitle: item.sermonTitle ?? '',
    attendance: 0,
    worshipLeader: '',
    praiseList: [],
    offerings: 0,
    notes: '',
    youtubeUrl: youtubeUrl(item.youtubeVideoId),
  };
}

export function worshipDetailToView(item: WorshipDetailResponse): Worship {
  return {
    id: String(item.id ?? ''),
    date: datePart(item.worshipAt),
    title: '예배',
    preacher: item.preacherName ?? '',
    scripture: item.verseReference ?? '',
    scriptureText: item.verseText ?? '',
    sermonTitle: item.sermonTitle ?? '',
    attendance: 0,
    worshipLeader: '',
    praiseList: [],
    offerings: 0,
    notes: '',
    youtubeUrl: item.youtubeUrl,
    bulletinImages: item.bulletins?.flatMap((bulletin) => bulletin.imageUrl ? [bulletin.imageUrl] : []) ?? [],
    inlinePraises: item.praises?.map((praise, index) => ({
      id: String(praise.id ?? index),
      title: praise.title ?? '',
      artist: praise.artist ?? '',
      youtubeUrl: youtubeUrl(praise.youtubeVideoId),
    })) ?? [],
    announcements: item.announcements?.map((announcement, index) => ({
      id: String(announcement.id ?? index),
      title: announcement.title ?? '',
      description: announcement.content ?? '',
    })) ?? [],
  };
}

export function worshipViewToRequest(worship: Omit<Worship, 'id'> | Worship): WorshipSaveRequest {
  return {
    sermonTitle: worship.sermonTitle,
    worshipAt: worship.date ? `${worship.date}T00:00:00` : undefined,
    preacherName: worship.preacher || undefined,
    verseReference: worship.scripture || undefined,
    verseText: worship.scriptureText || undefined,
    youtubeUrl: worship.youtubeUrl || undefined,
    status: 'PUBLISHED',
    bulletins: worship.bulletinImages?.map((imageUrl, index) => ({
      sortOrder: index,
      imageUrl,
      mimeType: imageUrl.match(/^data:([^;]+);/)?.[1] ?? 'image/jpeg',
    })),
    praises: worship.inlinePraises?.map((praise, index) => ({
      sortOrder: index,
      title: praise.title,
      artist: praise.artist || undefined,
      youtubeVideoId: youtubeVideoId(praise.youtubeUrl),
    })),
    announcements: worship.announcements?.map((announcement, index) => ({
      sortOrder: index,
      title: announcement.title,
      content: announcement.description || undefined,
      afterServiceEvent: false,
    })),
  };
}
