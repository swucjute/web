import { fetchWithAuth } from '../utils/authClient'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestConfig extends Omit<RequestInit, 'method'> {
  method: HttpMethod
  params?: Record<string, unknown>
}

function appendSearchParams(url: string, params?: Record<string, unknown>): string {
  if (!params) return url

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)))
      return
    }

    searchParams.append(key, String(value))
  })

  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

export class ApiError<TError = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly data: TError,
  ) {
    super(`API 요청에 실패했습니다. (${status})`)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(url: string, config: RequestConfig): Promise<T> {
  const { params, ...requestInit } = config
  const response = await fetchWithAuth(appendSearchParams(url, params), requestInit)

  const hasBody = ![204, 205, 304].includes(response.status)
  const data = hasBody ? await response.json() : undefined

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}

export type ErrorType<T> = ApiError<T>
export type BodyType<T> = T
