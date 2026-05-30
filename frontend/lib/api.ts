const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  const payload = contentType?.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : 'Request failed';
    throw new ApiError(message, res.status, payload);
  }
  return payload;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  return parseResponse(res) as Promise<T>;
}

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}
