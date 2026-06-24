import { useState, useEffect, useCallback } from 'react';
import {
  fetchTodoById,
  updateTodo,
  deleteTodo,
  toggleTodo as apiToggle,
} from '../api/todoApi';


/**
 * useTodo — State management for the TodoDetail page.
 *
 * Owns:
 *   - Fetch single todo by ID
 *   - Update and delete operations
 *   - Independent loading / error state (no shared state with TodoList)
 *
 * @param {string} id - The todo UUID read from ?id= query param
 */
export default function useTodo(id) {
  const [todo,    setTodo]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Fetch by ID ───────────────────────────────────────────────
  const fetchTodo = useCallback(async () => {
    if (!id) {
      setError('No todo ID provided in the URL.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodoById(id);
      setTodo(data);
    } catch (err) {
      setError(err.message || 'Failed to load todo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTodo(); }, [fetchTodo]);

  // ── Update ────────────────────────────────────────────────────
  const editTodo = useCallback(async (payload) => {
    const updated = await updateTodo(id, payload);
    setTodo(updated);
    return updated;
  }, [id]);

  // ── Toggle completed — calls PATCH /:id/toggle ─────────────────
  const toggleTodo = useCallback(async () => {
    const updated = await apiToggle(id);
    setTodo(updated);
    return updated;
  }, [id]);


  // ── Delete → caller redirects to "/" ─────────────────────────
  const removeTodo = useCallback(async () => {
    await deleteTodo(id);
  }, [id]);

  return { todo, loading, error, fetchTodo, editTodo, toggleTodo, removeTodo };
}
