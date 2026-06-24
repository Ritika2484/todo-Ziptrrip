/**
 * todoApi.js — All HTTP calls to the backend API.
 *
 * Base URL is set to http://localhost:3001/api.
 * All functions return parsed JSON data or throw a structured error.
 */

const BASE_URL = 'http://localhost:3001/api/todos';

/**
 * Parse a response and throw a rich error on non-2xx status.
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function parseResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message = data.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status  = res.status;
    err.errors  = data.errors || [];
    throw err;
  }
  return data;
}

/**
 * GET /api/todos
 * @param {Object} params - { search, status, priority, sortBy, sortDir }
 * @returns {Promise<Array>}
 */
export async function fetchAllTodos(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.set(key, val);
    }
  });
  const qs = query.toString();
  const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;
  const res = await fetch(url);
  const data = await parseResponse(res);
  return data.data;
}

/**
 * GET /api/todos/:id
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function fetchTodoById(id) {
  const res  = await fetch(`${BASE_URL}/${id}`);
  const data = await parseResponse(res);
  return data.data;
}

/**
 * POST /api/todos
 * @param {Object} payload - { title, description, priority, dueDate }
 * @returns {Promise<Object>}
 */
export async function createTodo(payload) {
  const res = await fetch(BASE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const data = await parseResponse(res);
  return data.data;
}

/**
 * PUT /api/todos/:id
 * @param {string} id
 * @param {Object} payload - Partial update fields
 * @returns {Promise<Object>}
 */
export async function updateTodo(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const data = await parseResponse(res);
  return data.data;
}

/**
 * DELETE /api/todos/:id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  await parseResponse(res);
}
