import { useQuery } from '@tanstack/react-query'
import { platformsApi } from '../utils/api'

/**
 * 플랫폼 상세 조회. 목록 캐시에는 content/purpose/etc가 없어서(상세 응답 전용 필드)
 * 상세 페이지는 이 훅으로 따로 조회한다.
 */
export function usePlatformDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['platform', id],
    queryFn: () => platformsApi.getById(id as string),
    enabled: !!id,
  })
}
