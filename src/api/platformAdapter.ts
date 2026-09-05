import type { ApiResponseObject } from './model'
import type { PageResponse, Platform } from '../types'

type PlatformDto = Omit<Platform, 'id'>

function unwrapData<T>(response: ApiResponseObject): T {
  if (response.data === undefined) {
    throw new Error(response.message ?? '플랫폼 API 응답에 data가 없습니다.')
  }

  return response.data as unknown as T
}

export function toPlatform(dto: PlatformDto): Platform {
  return { ...dto, id: String(dto.platformId) }
}

export function toPlatformFromResponse(response: ApiResponseObject): Platform {
  return toPlatform(unwrapData<PlatformDto>(response))
}

export function toPlatformsFromResponse(response: ApiResponseObject): Platform[] {
  const page = unwrapData<PageResponse<PlatformDto>>(response)
  return page.content.map(toPlatform)
}
