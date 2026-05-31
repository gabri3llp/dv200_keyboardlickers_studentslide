import { apiRequest, getAuthToken, saveSession } from './client';

const STUDENTS_API = '/students';

export async function registerUser(username, color, sequence, profile = {}) {
  const res = await fetch(`http://localhost:5000/api${STUDENTS_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, color, sequence, ...profile }),
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function loginUser(username, color, sequence) {
  const res = await fetch(`http://localhost:5000/api${STUDENTS_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, color, sequence }),
  });
  const data = await res.json();
  if (res.ok) saveSession(data);
  return { ok: res.ok, ...data };
}

export async function getMe() {
  if (!getAuthToken()) return { ok: false };

  try {
    const data = await apiRequest(`${STUDENTS_API}/me`);
    saveSession(data);
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
