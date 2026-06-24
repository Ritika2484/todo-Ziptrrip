import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo as apiToggle,
} from '../api/todoApi';


/**
 * useTodos — State management for the TodoList page.
 *
 * Owns:
 *   - Server fetch (todos, loading, error)
 *   - Client-side filtering (search, status, priority)
 *   - Client-side sorting (sortBy, sortDir)
 *   - CRUD operations (add, edit, delete, toggle)
 *
 * No shared global state — each page owns its own data independently.
 */
export default function useTodos() {
  const [todos,       setTodos]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy,      setSortBy]      = useState('createdAt');
  const [sortDir,     setSortDir]     = useState('desc');

  // ── Fetch all todos from the server ──────────────────────────
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  // ── Add a new todo ────────────────────────────────────────────
  const addTodo = useCallback(async (payload) => {
    const newTodo = await createTodo(payload);
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  // ── Edit a todo ───────────────────────────────────────────────
  const editTodo = useCallback(async (id, payload) => {
    const updated = await updateTodo(id, payload);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  // ── Delete a todo ─────────────────────────────────────────────
  const removeTodo = useCallback(async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Toggle completed — uses dedicated PATCH /:id/toggle endpoint ─
  const toggleTodo = useCallback(async (id) => {
    const updated = await apiToggle(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);


  // ── Client-side filter + sort ─────────────────────────────────
  const filteredTodos = useMemo(() => {
    const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
    let list = [...todos];

    // Search
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(term));
    }

    // Status
    if (statusFilter === 'active')    list = list.filter((t) => !t.completed);
    if (statusFilter === 'completed') list = list.filter((t) =>  t.completed);

    // Priority
    if (priorityFilter !== 'all') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    // Sort
    const dir = sortDir === 'desc' ? -1 : 1;
    list.sort((a, b) => {
      if (sortBy === 'priority') {
        return dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dir * (new Date(a.dueDate) - new Date(b.dueDate));
      }
      // createdAt (default)
      return dir * (new Date(a.createdAt) - new Date(b.createdAt));
    });

    return list;
  }, [todos, search, statusFilter, priorityFilter, sortBy, sortDir]);

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     todos.length,
    active:    todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) =>  t.completed).length,
    high:      todos.filter((t) => t.priority === 'high' && !t.completed).length,
  }), [todos]);

  return {
    todos: filteredTodos,
    loading,
    error,
    stats,
    search,      setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy,      setSortBy,
    sortDir,     setSortDir,
    fetchTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
  };
}
