import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-61a58ed0`;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${publicAnonKey}`,
};

async function request<T>(path: string, options?: RequestInit, retries = 2): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { ...headers, ...(options?.headers ?? {}) },
      });

      // Retry on 503 Service Unavailable (server initializing)
      if (res.status === 503 && attempt < retries) {
        console.log(`[API] Server initializing, retrying (${attempt + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API error ${res.status}: ${err}`);
      }

      return res.json() as Promise<T>;
    } catch (err) {
      lastError = err as Error;
      console.error(`[API] Request failed (attempt ${attempt + 1}/${retries + 1}):`, err);

      // Retry on network errors
      if (attempt < retries && (err instanceof TypeError || err.message.includes('fetch'))) {
        console.log(`[API] Network error, retrying (${attempt + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }

      throw err;
    }
  }

  throw lastError || new Error('Request failed after retries');
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

// ── Worships ─────────────────────────────────
export const worshipsApi = {
  getAll: () => request<any[]>('/worships'),
  add: (worship: any) => request<any>('/worships', { method: 'POST', body: JSON.stringify(worship) }),
  update: (id: string, data: any) => request<any>(`/worships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/worships/${id}`, { method: 'DELETE' }),
};

// ── Praises ──────────────────────────────────
export const praisesApi = {
  getAll: () => request<any[]>('/praises'),
  add: (praise: any) => request<any>('/praises', { method: 'POST', body: JSON.stringify(praise) }),
  update: (id: string, data: any) => request<any>(`/praises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/praises/${id}`, { method: 'DELETE' }),
};