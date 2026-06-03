export const API_URL = 'http://localhost:5000/api';

const TOKEN_KEY = 'studentslide_token';
const USER_KEY = 'studentslide_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const saveSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('crewmart_token');
};

export const authHeaders = (headers = {}) => {
  const token = getAuthToken();
  const user = getStoredUser();

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(user?.role ? { 'x-user-role': user.role } : {}),
  };
};

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: authHeaders(options.headers),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}
