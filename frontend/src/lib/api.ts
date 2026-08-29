const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('pelita_auth_token') || 'mock-token-demo-user-123';
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok || json.status === 'error') {
    throw new Error(json.message || 'API request failed');
  }

  return json.data as T;
}
