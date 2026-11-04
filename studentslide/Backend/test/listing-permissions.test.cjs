const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../Model/students');
const Listing = require('../Model/listings');
const Category = require('../Model/categories');

// Tests use real routes, JWTs and Mongoose validation with isolated in-memory
// persistence. Never connect to, read credentials for, or modify the shared Atlas DB.
process.env.JWT_SECRET = 'isolated-studentslide-regression-test-key';
const { JWT_SECRET } = require('../Middleware/auth');
const ids = {
  owner: '000000000000000000000001', other: '000000000000000000000002',
  admin: '000000000000000000000003', moderator: '000000000000000000000004',
  live: '000000000000000000000010', pending: '000000000000000000000011',
  legacy: '000000000000000000000012',
};
let students, listings, server, base, beforeAtomicUpdate;
const fields = { title: 'Textbook', category: 'Textbooks', price: 120, description: 'Good condition', image: 'https://example.com/book.jpg' };
const token = (who, role = 'admin') => jwt.sign({ id: ids[who] || who, role }, JWT_SECRET, { expiresIn: '1h' });

function document(data) {
  const listing = new Listing({ __v: 0, ...data });
  listing.save = async () => { await listing.validate(); listings.set(String(listing._id), listing); return listing; };
  listing.deleteOne = async () => { listings.delete(String(listing._id)); };
  return listing;
}

before(async () => {
  Student.findById = async (id) => students.get(String(id)) || null;
  Student.find = async () => [...students.values()];
  Student.findOne = async ({ email }) => [...students.values()].find((s) => s.email === email) || null;
  Student.create = async (data) => {
    const student = new Student(data);
    await student.validate();
    students.set(String(student._id), student);
    return student;
  };
  Student.findByIdAndUpdate = async (id, data) => {
    const student = students.get(String(id));
    if (student) Object.assign(student, data);
    return student;
  };
  Listing.find = (filter) => ({ sort: async () => [...listings.values()].filter((item) =>
    Object.entries(filter).every(([key, value]) => String(item[key]) === String(value))) });
  Listing.findById = async (id) => {
    const stored = listings.get(String(id));
    return stored ? document(stored.toObject()) : null;
  };
  Listing.create = async (data) => document(data).save();
  Listing.exists = async ({ _id }) => listings.has(String(_id)) ? { _id } : null;
  Listing.findOneAndUpdate = async (filter, update, options) => {
    // Deterministic interleavings exercise the real route's atomic boundary.
    const hook = beforeAtomicUpdate;
    beforeAtomicUpdate = null;
    if (hook) await hook();
    const listing = listings.get(String(filter._id));
    if (!listing) return null;
    if (filter.seller && String(listing.seller) !== String(filter.seller)) return null;
    if (filter.__v !== undefined && listing.__v !== filter.__v) return null;
    if (filter.$or && !(listing.__v === 0 || listing.__v === undefined)) return null;
    assert.equal(options.runValidators, true);
    assert.equal(options.new, true);
    const updated = document({ ...listing.toObject(), ...update.$set, __v: (listing.__v ?? 0) + update.$inc.__v });
    return updated.save();
  };
  Listing.findOneAndDelete = async (filter) => {
    const hook = beforeAtomicUpdate;
    beforeAtomicUpdate = null;
    if (hook) await hook();
    const listing = listings.get(String(filter._id));
    if (!listing) return null;
    if (filter.seller && String(listing.seller) !== String(filter.seller)) return null;
    if (filter.__v !== undefined && listing.__v !== filter.__v) return null;
    if (filter.$or && !(listing.__v === 0 || listing.__v === undefined)) return null;
    listings.delete(String(listing._id));
    return listing;
  };
  Category.create = async (data) => data;
  const app = express();
  app.use(express.json());
  app.use('/api/students', require('../Routes/students'));
  app.use('/api/listings', require('../Routes/listings'));
  app.use('/api/categories', require('../Routes/categories'));
  server = await new Promise((resolve) => { const running = app.listen(0, '127.0.0.1', () => resolve(running)); });
  base = `http://127.0.0.1:${server.address().port}/api`;
});

beforeEach(() => {
  beforeAtomicUpdate = null;
  students = new Map(Object.entries(ids).filter(([name]) => ['owner', 'other', 'admin', 'moderator'].includes(name))
    .map(([name, id]) => [id, new Student({ _id: id, name, surname: 'Student', email: `${name}@example.com`, studentNum: id, password: 'fixture', color: 'blue', sequence: ['wires'], role: ['admin', 'moderator'].includes(name) ? name : 'normal' })]));
  listings = new Map([
    [ids.live, document({ ...fields, _id: ids.live, seller: ids.owner, sellerName: 'owner Student', listingState: 'live' })],
    [ids.pending, document({ ...fields, _id: ids.pending, seller: ids.other, listingState: 'pending' })],
    [ids.legacy, document({ ...fields, _id: ids.legacy, listingState: 'pending' })],
  ]);
});
after(async () => { await new Promise((resolve) => server.close(resolve)); });

async function request(path, { who, method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { ...(who ? { Authorization: `Bearer ${token(who)}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}

test('anonymous reads only live listings, including injected pending/seller queries', async () => {
  const result = await request(`/listings?state=pending&seller=${ids.other}`);
  assert.equal(result.status, 200);
  assert.deepEqual(result.data.map((item) => item._id), [ids.live]);
});

test('header-only and invalid tokens cannot create, edit, delete or moderate listings', async () => {
  for (const headers of [{ 'x-user-role': 'admin' }, { Authorization: 'Bearer invalid', 'x-user-role': 'moderator' }]) {
    for (const [method, path, body] of [['POST', '/listings', fields], ['PATCH', `/listings/${ids.live}`, { title: 'hijack' }], ['DELETE', `/listings/${ids.live}`], ['PATCH', `/listings/${ids.live}/state`, { listingState: 'pending', expectedVersion: 0 }]]) {
      assert.equal((await request(path, { method, body, headers })).status, 401);
    }
  }
  assert.equal(listings.size, 3);
  assert.equal(listings.get(ids.live).title, fields.title);
});

test('claimed admin header and stale privileged JWT role do not grant moderation', async () => {
  assert.equal((await request(`/listings/${ids.pending}/state`, { who: 'owner', method: 'PATCH', body: { listingState: 'live', expectedVersion: 0 }, headers: { 'x-user-role': 'admin' } })).status, 403);
  assert.equal((await request('/listings/review', { who: 'owner' })).status, 403);
});

test('current DB roles govern demotion, promotion and removed accounts', async () => {
  const headers = { Authorization: `Bearer ${token('admin')}` };
  students.get(ids.admin).role = 'normal';
  assert.equal((await request('/listings/review', { headers })).status, 403);
  students.get(ids.admin).role = 'moderator';
  assert.equal((await request('/listings/review', { headers })).status, 200);
  students.delete(ids.admin);
  assert.equal((await request('/listings/review', { headers })).status, 401);
});

test('known old signing key and malformed account identities are rejected', async () => {
  for (const forged of [jwt.sign({ id: ids.admin }, 'studentslide-dev-secret'), jwt.sign({ id: { $ne: null } }, JWT_SECRET)]) {
    assert.equal((await request('/listings/review', { headers: { Authorization: `Bearer ${forged}`, 'x-user-role': 'admin' } })).status, 401);
  }
});

test('new listings use the authenticated seller and force pending despite injected fields', async () => {
  const result = await request('/listings', { who: 'owner', method: 'POST', body: { ...fields, seller: ids.other, sellerName: 'Impersonated', listingState: 'live', role: 'admin' } });
  assert.equal(result.status, 201);
  assert.equal(result.data.seller, ids.owner);
  assert.equal(result.data.sellerName, 'owner Student');
  assert.equal(result.data.listingState, 'pending');
});

test('My Listings is scoped on the server, even for admins and injected seller queries', async () => {
  assert.equal((await request('/listings/mine')).status, 401);
  const own = await request(`/listings/mine?seller=${ids.other}`, { who: 'owner' });
  assert.deepEqual(own.data.map((item) => item._id), [ids.live]);
  assert.deepEqual((await request('/listings/mine', { who: 'other' })).data.map((item) => item._id), [ids.pending]);
  assert.deepEqual((await request('/listings/mine', { who: 'admin' })).data, []);
});

test('seller edits own listing, cannot transfer ownership or self-publish, and returns to review', async () => {
  const result = await request(`/listings/${ids.live}`, { who: 'owner', method: 'PATCH', body: { title: 'Updated textbook', seller: ids.other, sellerName: 'hijack', listingState: 'live', $set: { seller: ids.other } } });
  assert.equal(result.status, 200);
  assert.equal(result.data.title, 'Updated textbook');
  assert.equal(result.data.seller, ids.owner);
  assert.equal(result.data.sellerName, 'owner Student');
  assert.equal(result.data.listingState, 'pending');
  assert.deepEqual((await request('/listings')).data, []);
});

test('another seller cannot edit/delete and cannot claim a legacy listing', async () => {
  for (const id of [ids.live, ids.legacy]) {
    assert.equal((await request(`/listings/${id}`, { who: 'other', method: 'PATCH', body: { title: 'hijack', seller: ids.other }, headers: { 'x-user-role': 'admin' } })).status, 403);
    assert.equal((await request(`/listings/${id}`, { who: 'other', method: 'DELETE' })).status, 403);
  }
  assert.equal(listings.size, 3);
});

test('owner can delete own listing', async () => {
  assert.equal((await request(`/listings/${ids.live}?expectedVersion=0`, { who: 'owner', method: 'DELETE' })).status, 200);
  assert.equal(listings.has(ids.live), false);
});

test('admin and moderator retain review, approval and legacy management', async () => {
  for (const who of ['admin', 'moderator']) {
    assert.equal((await request('/listings/review', { who })).data.length, 3);
    assert.equal((await request(`/listings/${ids.legacy}`, { who, method: 'PATCH', body: { description: 'Reviewed legacy item' } })).status, 200);
    assert.equal((await request(`/listings/${ids.pending}/state`, { who, method: 'PATCH', body: { listingState: 'live', expectedVersion: listings.get(ids.pending).__v } })).status, 200);
  }
  assert.equal((await request(`/listings/${ids.legacy}?expectedVersion=${listings.get(ids.legacy).__v}`, { who: 'moderator', method: 'DELETE' })).status, 200);
});

test('pending details require owner or staff; live details remain public', async () => {
  assert.equal((await request(`/listings/${ids.live}`)).status, 200);
  assert.equal((await request(`/listings/${ids.pending}`)).status, 401);
  assert.equal((await request(`/listings/${ids.pending}`, { who: 'owner' })).status, 403);
  assert.equal((await request(`/listings/${ids.pending}`, { who: 'other' })).status, 200);
  assert.equal((await request(`/listings/${ids.legacy}`, { who: 'moderator' })).status, 200);
});

test('invalid IDs, invalid state, invalid price and state-only detail updates are rejected', async () => {
  assert.equal((await request('/listings/not-an-id')).status, 400);
  assert.equal((await request(`/listings/${ids.live}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'unknown', expectedVersion: 0 } })).status, 400);
  assert.equal((await request('/listings', { who: 'owner', method: 'POST', body: { ...fields, price: -1 } })).status, 400);
  assert.equal((await request(`/listings/${ids.live}`, { who: 'owner', method: 'PATCH', body: { listingState: 'live' } })).status, 400);
});

test('image URL and uploaded data-image listing forms remain valid', async () => {
  for (const image of [fields.image, 'data:image/png;base64,aGVsbG8=']) {
    assert.equal((await request('/listings', { who: 'owner', method: 'POST', body: { ...fields, image } })).status, 201);
  }
});

test('role self-promotion through header is denied; a real admin can change roles', async () => {
  const path = `/students/${ids.owner}/role`;
  assert.equal((await request(path, { who: 'owner', method: 'PATCH', body: { role: 'admin' }, headers: { 'x-user-role': 'admin' } })).status, 403);
  assert.equal(students.get(ids.owner).role, 'normal');
  assert.equal((await request(path, { who: 'admin', method: 'PATCH', body: { role: 'moderator' } })).status, 200);
  assert.equal(students.get(ids.owner).role, 'moderator');
});

test('basic signup cannot create privileged account, stores hash and omits secrets', async () => {
  const result = await request('/students', { method: 'POST', body: { name: 'New', surname: 'Student', email: 'new@example.com', studentNum: 'new', password: 'example-password', role: 'admin', color: 'blue', sequence: ['wires'] } });
  assert.equal(result.status, 201);
  assert.equal(result.data.role, 'normal');
  assert.equal(result.data.password, undefined);
  assert.equal(result.data.sequence, undefined);
  assert.equal(await bcrypt.compare('example-password', students.get(result.data._id).password), true);
});

test('creative registration/login and authenticated account lookup still work without privileged signup', async () => {
  const payload = { username: 'creative@example.com', color: 'blue', sequence: ['wires'], role: 'admin' };
  const registration = await request('/students/register', { method: 'POST', body: payload });
  assert.equal(registration.status, 201);
  assert.equal(registration.data.user.role, 'normal');
  const login = await request('/students/login', { method: 'POST', body: payload });
  assert.equal(login.status, 200);
  const me = await request('/students/me', { headers: { Authorization: `Bearer ${login.data.token}` } });
  assert.equal(me.status, 200);
  assert.equal(me.data.user.email, payload.username);
});

test('category creation rejects claimed admin, preserves authenticated admin action', async () => {
  const body = { name: 'Textbooks' };
  assert.equal((await request('/categories', { method: 'POST', body, headers: { 'x-user-role': 'admin' } })).status, 401);
  assert.equal((await request('/categories', { who: 'owner', method: 'POST', body, headers: { 'x-user-role': 'admin' } })).status, 403);
  assert.equal((await request('/categories', { who: 'admin', method: 'POST', body })).status, 201);
});

test('accounts without creative credentials cannot be logged in using empty defaults', async () => {
  students.get(ids.admin).color = '';
  students.get(ids.admin).sequence = [];
  for (const body of [
    { username: 'admin@example.com', color: '', sequence: [] },
    { username: 'admin@example.com', color: 'blue', sequence: [] },
    { username: { $ne: null }, color: 'blue', sequence: ['wires'] },
  ]) {
    assert.equal((await request('/students/login', { method: 'POST', body })).status, 400);
    assert.equal((await request('/students/register', { method: 'POST', body })).status, 400);
  }
});

test('moderation validates revision input rather than accepting missing or coercible versions', async () => {
  for (const expectedVersion of [undefined, null, '0', -1, 0.5, { $ne: null }, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal((await request(`/listings/${ids.pending}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion } })).status, 400);
  }
  assert.equal(listings.get(ids.pending).listingState, 'pending');
});

test('stale approval cannot publish content edited after review; refreshed version can be approved', async () => {
  const edited = await request(`/listings/${ids.pending}`, { who: 'other', method: 'PATCH', body: { title: 'Changed after review' } });
  assert.equal(edited.status, 200);
  assert.equal(edited.data.__v, 1);
  const stale = await request(`/listings/${ids.pending}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion: 0 } });
  assert.equal(stale.status, 409);
  assert.equal(listings.get(ids.pending).listingState, 'pending');
  const refreshed = await request(`/listings/${ids.pending}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion: edited.data.__v } });
  assert.equal(refreshed.status, 200);
  assert.equal(refreshed.data.__v, 2);
  const unpublished = await request(`/listings/${ids.pending}/state`, { who: 'moderator', method: 'PATCH', body: { listingState: 'pending', expectedVersion: refreshed.data.__v } });
  assert.equal(unpublished.status, 200);
  assert.equal(unpublished.data.__v, 3);
});

test('approval racing between seller read and update cannot leave edited content live', async () => {
  beforeAtomicUpdate = async () => {
    const approved = await request(`/listings/${ids.pending}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion: 0 } });
    assert.equal(approved.status, 200);
  };
  const edited = await request(`/listings/${ids.pending}`, { who: 'other', method: 'PATCH', body: { description: 'New unreviewed description' } });
  assert.equal(edited.status, 200);
  assert.equal(edited.data.listingState, 'pending');
  assert.equal(edited.data.__v, 2);
  assert.equal(listings.get(ids.pending).listingState, 'pending');
});

test('seller edit racing before moderation write invalidates approval', async () => {
  beforeAtomicUpdate = async () => {
    const edited = await request(`/listings/${ids.pending}`, { who: 'other', method: 'PATCH', body: { title: 'Concurrent edit' } });
    assert.equal(edited.status, 200);
  };
  const approval = await request(`/listings/${ids.pending}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion: 0 } });
  assert.equal(approval.status, 409);
  assert.equal(listings.get(ids.pending).listingState, 'pending');
  assert.equal(listings.get(ids.pending).title, 'Concurrent edit');
});

test('legacy versionless sellerless listings can be reviewed and missing listings return 404', async () => {
  listings.get(ids.legacy).__v = undefined;
  const approval = await request(`/listings/${ids.legacy}/state`, { who: 'moderator', method: 'PATCH', body: { listingState: 'live', expectedVersion: 0 } });
  assert.equal(approval.status, 200);
  assert.equal(approval.data.__v, 1);
  assert.equal(approval.data.seller, undefined);
  listings.delete(ids.legacy);
  assert.equal((await request(`/listings/${ids.legacy}/state`, { who: 'admin', method: 'PATCH', body: { listingState: 'live', expectedVersion: 1 } })).status, 404);
});

test('missing secret creates unpredictable local key and fails closed in production', () => {
  const cwd = require('node:path').resolve(__dirname, '..');
  const source = "const {JWT_SECRET}=require('./Middleware/auth'); process.stdout.write(String(JWT_SECRET.length >= 64 && JWT_SECRET !== 'studentslide-dev-secret'));";
  const local = spawnSync(process.execPath, ['-e', source], { cwd, env: { ...process.env, JWT_SECRET: '', NODE_ENV: 'development' }, encoding: 'utf8' });
  assert.equal(local.status, 0);
  assert.equal(local.stdout, 'true');
  const production = spawnSync(process.execPath, ['-e', source], { cwd, env: { ...process.env, JWT_SECRET: '', NODE_ENV: 'production' }, encoding: 'utf8' });
  assert.notEqual(production.status, 0);
  assert.match(production.stderr, /JWT_SECRET must be configured/);
});

test('stale removal cannot delete a revised listing; fresh removal remains allowed', async () => {
  const edited = await request(`/listings/${ids.pending}`, { who: 'other', method: 'PATCH', body: { title: 'Revised submission' } });
  assert.equal(edited.status, 200);
  const stale = await request(`/listings/${ids.pending}?expectedVersion=0`, { who: 'moderator', method: 'DELETE' });
  assert.equal(stale.status, 409);
  assert.equal(listings.has(ids.pending), true);
  const fresh = await request(`/listings/${ids.pending}?expectedVersion=${edited.data.__v}`, { who: 'moderator', method: 'DELETE' });
  assert.equal(fresh.status, 200);
  assert.equal(listings.has(ids.pending), false);
});

test('deletion validates versions and protects edits racing after the ownership lookup', async () => {
  for (const suffix of ['', '?expectedVersion=bad', '?expectedVersion=-1', '?expectedVersion=0.5', '?expectedVersion[]=0', '?expectedVersion=9007199254740992']) {
    assert.equal((await request(`/listings/${ids.pending}${suffix}`, { who: 'moderator', method: 'DELETE' })).status, 400);
  }
  beforeAtomicUpdate = async () => {
    const edited = await request(`/listings/${ids.pending}`, { who: 'other', method: 'PATCH', body: { title: 'Concurrent seller edit' } });
    assert.equal(edited.status, 200);
  };
  assert.equal((await request(`/listings/${ids.pending}?expectedVersion=0`, { who: 'moderator', method: 'DELETE' })).status, 409);
  assert.equal(listings.get(ids.pending).title, 'Concurrent seller edit');
});
