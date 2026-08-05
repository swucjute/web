import { useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * 목록형 리소스(Event/Worship/Praise/Survey/Platform/User 등) 공용 쿼리 훅.
 * 낙관적 업데이트 + 실패 시 롤백 + 성공/실패 후 서버 재검증(invalidate)을 한 곳에 모아
 * 각 Context에서 반복되던 fetch/useState/useEffect/optimistic-update 보일러플레이트를 제거한다.
 */
export function useCrudQuery<T extends { id: string }>(key: string, queryFn: () => Promise<T[]>) {
  const queryClient = useQueryClient()
  const queryKey = [key] as const
  const query = useQuery({ queryKey, queryFn })

  const setData = (updater: (prev: T[]) => T[]) => {
    queryClient.setQueryData<T[]>(queryKey, (prev) => updater(prev ?? []))
  }

  const optimisticMutate = async (updater: (prev: T[]) => T[], action: () => Promise<unknown>) => {
    const previous = queryClient.getQueryData<T[]>(queryKey)
    setData(updater)
    try {
      await action()
    } catch (err) {
      console.error(`[${key}] mutation failed, rolling back:`, err)
      queryClient.setQueryData(queryKey, previous)
    } finally {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  return { data: query.data ?? [], isLoading: query.isLoading, optimisticMutate, setData }
}
