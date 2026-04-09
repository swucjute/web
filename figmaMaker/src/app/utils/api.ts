import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-61a58ed0`;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${publicAnonKey}`,
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

// ── Members ──────────────────────────────────
export const membersApi = {
  getAll: () => request<any[]>('/members'),
  add: (member: any) => request<any>('/members', { method: 'POST', body: JSON.stringify(member) }),
  update: (id: string, data: any) => request<any>(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/members/${id}`, { method: 'DELETE' }),
};

// ── Platforms ────────────────────────────────
export const platformsApi = {
  getAll: () => request<any[]>('/platforms'),
  add: (platform: any) => request<any>('/platforms', { method: 'POST', body: JSON.stringify(platform) }),
  update: (id: string, data: any) => request<any>(`/platforms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/platforms/${id}`, { method: 'DELETE' }),
};

// ── Events ───────────────────────────────────
export const eventsApi = {
  getAll: () => request<any[]>('/events'),
  add: (event: any) => request<any>('/events', { method: 'POST', body: JSON.stringify(event) }),
  update: (id: string, data: any) => request<any>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/events/${id}`, { method: 'DELETE' }),
};

// ── Surveys ──────────────────────────────────
export const surveysApi = {
  getAll: () => request<any[]>('/surveys'),
  add: (survey: any) => request<any>('/surveys', { method: 'POST', body: JSON.stringify(survey) }),
  update: (id: string, data: any) => request<any>(`/surveys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/surveys/${id}`, { method: 'DELETE' }),
  respond: (id: string, userId: string, userName: string, answers: any) =>
    request<any>(`/surveys/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ userId, userName, answers }),
    }),
};