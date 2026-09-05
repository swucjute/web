import type {
  ApiResponsePageResponsePlatformListItemResponse,
  ApiResponsePlatformDetailResponse,
  PlatformDetailResponse,
  PlatformListItemResponse,
} from './model'
import type { Platform } from '../types'

function required<T>(value: T | null | undefined, field: string): T {
  if (value === undefined || value === null) {
    throw new Error(`플랫폼 API 응답에 ${field}가 없습니다.`)
  }

  return value
}

export function toPlatform(dto: PlatformListItemResponse | PlatformDetailResponse): Platform {
  const platformId = required(dto.platformId, 'platformId')

  return {
    id: String(platformId),
    platformId,
    title: required(dto.title, 'title'),
    scheduleText: dto.scheduleText ?? null,
    startsAt: dto.startsAt ?? null,
    endsAt: dto.endsAt ?? null,
    location: dto.location ?? null,
    posterUrl: dto.posterUrl ?? null,
    approvalStatus: required(dto.approvalStatus, 'approvalStatus'),
    recruiting: required(dto.recruiting, 'recruiting'),
    operating: required(dto.operating, 'operating'),
    closedStatus: dto.closedStatus ?? null,
    approvedMemberCount: required(dto.approvedMemberCount, 'approvedMemberCount'),
    ownerMemberId: required(dto.ownerMemberId, 'ownerMemberId'),
    ownerName: dto.ownerName ?? null,
    createdAt: required(dto.createdAt, 'createdAt'),
  }
}

export function toPlatformFromResponse(response: ApiResponsePlatformDetailResponse): Platform {
  const dto = required(response.data, 'data')
  return {
    ...toPlatform(dto),
    content: dto.content ?? null,
    purpose: dto.purpose ?? null,
    etc: dto.etc ?? null,
    updatedAt: dto.updatedAt,
  }
}

export function toPlatformsFromResponse(
  response: ApiResponsePageResponsePlatformListItemResponse,
): Platform[] {
  const page = required(response.data, 'data')
  return required(page.content, 'data.content').map(toPlatform)
}
