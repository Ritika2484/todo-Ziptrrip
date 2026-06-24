/**
 * historyApi.js — All fetch calls for the History audit log.
 */

const BASE_URL = 'http://localhost:3001/api/history';

async function parseResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * GET /api/history
 * @param {Object} params  — { action, search, todoId, limit }
 * @returns {Promise<Array>}
 */
export async function fetchAllHistory(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v);
  });
  const qs  = query.toString();
  const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;
  const res = await fetch(url);
  const data = await parseResponse(res);
  return data.data;
}

/**
 * GET /api/history/todo/:todoId
 * @param {string} todoId
 * @returns {Promise<Array>}
 */
export async function fetchHistoryByTodoId(todoId) {
  const res  = await fetch(`${BASE_URL}/todo/${todoId}`);
  const data = await parseResponse(res);
  return data.data;
}

/**
 * DELETE /api/history   (requires { confirm: true } body)
 * @returns {Promise<void>}
 */
export async function clearAllHistory() {
  const res = await fetch(BASE_URL, {
    method:  'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ confirm: true }),
  });
  await parseResponse(res);
}
