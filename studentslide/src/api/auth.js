const API = 'http://localhost:5000/api/students';

export async function registerUser(username, color, sequence) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, color, sequence }),
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function loginUser(username, color, sequence) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, color, sequence }),
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function getMe() {
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('crewmart_token')}` },
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}