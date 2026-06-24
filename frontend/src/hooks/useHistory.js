import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAllHistory, clearAllHistory } from '../api/historyApi';

const VALID_ACTIONS = ['created', 'updated', 'completed', 'uncompleted', 'deleted'];

/**
 * useHistory — State management for the History page.
 *
 * Owns:
 *   - Fetch all history entries on mount
 *   - Client-side action filter + title search
 *   - Date-group logic (Today / Yesterday / Earlier)
 *   - Clear all history operation
 */
export default function useHistory() {
  const [history,      setHistory]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [actionFilter, setActionFilter] = useState('all');
  const [search,       setSearch]       = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // ── Clear ─────────────────────────────────────────────────────
  const clearHistory = useCallback(async () => {
    await clearAllHistory();
    setHistory([]);
  }, []);

  // ── Client-side filter ────────────────────────────────────────
  const filteredHistory = useMemo(() => {
    let list = [...history];

    if (actionFilter !== 'all' && VALID_ACTIONS.includes(actionFilter)) {
      list = list.filter((e) => e.action === actionFilter);
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((e) =>
        e.todoTitle && e.todoTitle.toLowerCase().includes(term)
      );
    }

    return list;
  }, [history, actionFilter, search]);

  // ── Date-group the filtered list ──────────────────────────────
  const groupedHistory = useMemo(() => {
    const today     = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    const groups = {};

    for (const entry of filteredHistory) {
      const d = new Date(entry.timestamp);
      d.setHours(0, 0, 0, 0);

      let label;
      if (d.getTime() === today.getTime())     label = 'Today';
      else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
      else label = new Date(entry.timestamp).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });

      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    }

    return groups;
  }, [filteredHistory]);

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = history.filter((e) => {
      const d = new Date(e.timestamp); d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length;

    const counts = {};
    for (const action of VALID_ACTIONS) {
      counts[action] = history.filter((e) => e.action === action).length;
    }

    return { total: history.length, todayCount, counts };
  }, [history]);

  return {
    history: filteredHistory,
    groupedHistory,
    loading,
    error,
    stats,
    actionFilter, setActionFilter,
    search,       setSearch,
    fetchHistory,
    clearHistory,
  };
}
