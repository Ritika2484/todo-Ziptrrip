import { useState, useRef, useEffect } from 'react';
import useHistory from '../hooks/useHistory';

/* ── Action metadata ────────────────────────────────────────── */
const ACTION_META = {
  created:    { label: 'Created',     icon: '✨', color: 'var(--accent-1)',        bg: 'rgba(99,102,241,0.12)'  },
  updated:    { label: 'Updated',     icon: '✏️', color: 'var(--priority-medium)', bg: 'rgba(245,158,11,0.12)' },
  completed:  { label: 'Completed',   icon: '✅', color: 'var(--priority-low)',    bg: 'rgba(34,197,94,0.12)'  },
  uncompleted:{ label: 'Uncompleted', icon: '↩️', color: 'var(--completed-color)', bg: 'rgba(100,116,139,0.12)'},
  deleted:    { label: 'Deleted',     icon: '🗑️', color: 'var(--priority-high)',   bg: 'rgba(239,68,68,0.12)'  },
};

const ACTION_FILTER_TABS = [
  { value: 'all',         label: 'All' },
  { value: 'created',     label: '✨ Created' },
  { value: 'updated',     label: '✏️ Updated' },
  { value: 'completed',   label: '✅ Completed' },
  { value: 'uncompleted', label: '↩️ Uncompleted' },
  { value: 'deleted',     label: '🗑️ Deleted' },
];

/* ── Helpers ─────────────────────────────────────────────────── */
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatFieldName(field) {
  const map = {
    title: 'Title', description: 'Description', priority: 'Priority',
    completed: 'Status', dueDate: 'Due Date',
  };
  return map[field] || field;
}

function formatFieldValue(field, value) {
  if (value === null || value === undefined) return '—';
  if (field === 'completed') return value ? 'Completed' : 'Active';
  if (field === 'dueDate' && value) {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (typeof value === 'string' && value.length > 60) return value.slice(0, 60) + '…';
  return String(value);
}

/* ── Sub-components ──────────────────────────────────────────── */

/** Expandable diff block for 'updated' entries */
function ChangesDiff({ changes }) {
  const [open, setOpen] = useState(false);
  if (!changes || Object.keys(changes).length === 0) return null;

  const fields = Object.keys(changes);

  return (
    <div className="history-changes">
      <button
        className="changes-toggle"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-expanded={open}
        aria-label={open ? 'Hide changes' : `Show ${fields.length} change${fields.length > 1 ? 's' : ''}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '200ms' }} aria-hidden="true">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        {fields.length} field{fields.length > 1 ? 's' : ''} changed
      </button>
      {open && (
        <div className="changes-list" role="list">
          {fields.map((field) => (
            <div className="change-row" key={field} role="listitem">
              <span className="change-field">{formatFieldName(field)}</span>
              <span className="change-from">{formatFieldValue(field, changes[field].from)}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="changed to" className="change-arrow">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              <span className="change-to">{formatFieldValue(field, changes[field].to)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** A single history timeline entry */
function HistoryEntry({ entry, isLast }) {
  const meta = ACTION_META[entry.action] || ACTION_META.updated;

  return (
    <div className={`history-entry ${isLast ? 'last' : ''}`}>
      {/* Timeline connector */}
      <div className="timeline-track" aria-hidden="true">
        <div
          className="timeline-dot"
          style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}60` }}
          title={meta.label}
        >
          <span role="img" aria-label={meta.label} style={{ fontSize: '10px', lineHeight: 1 }}>
            {meta.icon}
          </span>
        </div>
        {!isLast && <div className="timeline-line" />}
      </div>

      {/* Entry content */}
      <div className="history-entry-card">
        <div className="history-entry-header">
          <span
            className="history-action-badge"
            style={{ color: meta.color, background: meta.bg }}
          >
            {meta.label}
          </span>
          <span className="history-time">{formatTime(entry.timestamp)}</span>
        </div>

        {/* Todo title — links to detail page */}
        <a
          href={`/todo.html?id=${entry.todoId}`}
          className="history-todo-title"
          title={`View todo: ${entry.todoTitle}`}
          onClick={(e) => {
            if (entry.action === 'deleted') {
              e.preventDefault();
              alert('This todo has been deleted and can no longer be viewed.');
            }
          }}
        >
          {entry.todoTitle}
          {entry.action !== 'deleted' && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          )}
        </a>

        {/* Changes diff (only for 'updated') */}
        {entry.action === 'updated' && entry.changes && (
          <ChangesDiff changes={entry.changes} />
        )}

        {/* ID chip */}
        <div className="history-entry-footer">
          <span className="history-todo-id" title="Todo ID">{entry.todoId}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main History Page ───────────────────────────────────────── */

/**
 * History — Page 3, served at history.html.
 *
 * Features:
 *  - Fetches all history on mount (independent data ownership)
 *  - Stats: total entries, today's count, per-action counts
 *  - Filter tabs: All / Created / Updated / Completed / Uncompleted / Deleted
 *  - Real-time title search (debounced 300ms)
 *  - Timeline grouped by date (Today / Yesterday / date)
 *  - Expandable diff for 'updated' entries
 *  - Clear History with confirmation
 *  - Loading, empty, error states
 */
export default function History() {
  const {
    history, groupedHistory, loading, error, stats,
    actionFilter, setActionFilter,
    search,       setSearch,
    fetchHistory, clearHistory,
  } = useHistory();

  const [confirmClear,  setConfirmClear]  = useState(false);
  const [clearLoading,  setClearLoading]  = useState(false);

  const searchRef   = useRef(null);
  const debounceRef = useRef(null);

  function handleSearchInput(e) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(e.target.value), 300);
  }

  useEffect(() => {
    if (searchRef.current) searchRef.current.value = search;
  }, []); // eslint-disable-line

  async function handleClearHistory() {
    try {
      setClearLoading(true);
      await clearHistory();
      setConfirmClear(false);
    } catch (err) {
      alert('Failed to clear history: ' + err.message);
    } finally {
      setClearLoading(false);
    }
  }

  const dateGroups = Object.entries(groupedHistory);

  return (
    <div className="page-container" id="history-page">

      {/* Page heading */}
      <div className="page-title-block">
        <div className="title-row">
          <div>
            <h1>Activity <span className="gradient-text">History</span></h1>
            <p className="page-subtitle">A complete audit log of every action taken on your todos.</p>
          </div>
          {!loading && !error && stats.total > 0 && (
            <button
              className="btn-danger"
              onClick={() => setConfirmClear(true)}
              id="clear-history-btn"
              style={{ alignSelf: 'flex-start' }}
              aria-label="Clear all history"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <div className="stats-row" aria-label="History statistics">
          <div className="stat-chip"><span>{stats.total}</span> Total</div>
          <div className="stat-chip"><span>{stats.todayCount}</span> Today</div>
          {stats.counts.created    > 0 && <div className="stat-chip" style={{ color: 'var(--accent-1)' }}><span style={{ color: 'var(--accent-1)' }}>{stats.counts.created}</span> Created</div>}
          {stats.counts.completed  > 0 && <div className="stat-chip" style={{ color: 'var(--priority-low)' }}><span style={{ color: 'var(--priority-low)' }}>{stats.counts.completed}</span> Completed</div>}
          {stats.counts.deleted    > 0 && <div className="stat-chip" style={{ color: 'var(--priority-high)' }}><span style={{ color: 'var(--priority-high)' }}>{stats.counts.deleted}</span> Deleted</div>}
        </div>
      )}

      {/* Filter bar */}
      {!loading && !error && (
        <div className="filter-bar" style={{ gap: '12px' }}>
          {/* Search */}
          <div className="search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              type="search"
              className="search-input"
              placeholder="Search by todo title…"
              defaultValue={search}
              onChange={handleSearchInput}
              id="history-search-input"
              aria-label="Search history by todo title"
            />
          </div>

          {/* Action filter tabs — scrollable on mobile */}
          <div className="history-action-tabs" role="tablist" aria-label="Filter by action">
            {ACTION_FILTER_TABS.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={actionFilter === value}
                className={`tab-btn ${actionFilter === value ? 'active' : ''}`}
                onClick={() => setActionFilter(value)}
                id={`history-tab-${value}`}
              >
                {label}
                {value !== 'all' && stats.counts[value] > 0 && (
                  <span className="tab-count">{stats.counts[value]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-wrapper" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">Loading history…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="error-box" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p><strong>Failed to load history</strong></p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && dateGroups.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{history.length === 0 && stats.total === 0 ? 'No history yet' : 'No matching entries'}</h3>
          <p>
            {stats.total === 0
              ? 'Actions you take on todos will appear here as an audit log.'
              : 'Try changing the filter or clearing the search.'}
          </p>
          {stats.total > 0 && (
            <button
              className="btn-secondary"
              onClick={() => { setActionFilter('all'); setSearch(''); if (searchRef.current) searchRef.current.value = ''; }}
              id="history-clear-filters-btn"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Timeline */}
      {!loading && !error && dateGroups.length > 0 && (
        <div className="history-timeline" aria-label="Activity history timeline">
          {dateGroups.map(([dateLabel, entries]) => (
            <section key={dateLabel} className="history-date-group">
              <h2 className="history-date-label" aria-label={`History for ${dateLabel}`}>
                <span>{dateLabel}</span>
                <span className="date-count">{entries.length} event{entries.length !== 1 ? 's' : ''}</span>
              </h2>
              <div className="history-entries" role="list" aria-label={`${dateLabel} entries`}>
                {entries.map((entry, idx) => (
                  <div key={entry.id} role="listitem">
                    <HistoryEntry entry={entry} isLast={idx === entries.length - 1} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Clear confirmation modal */}
      {confirmClear && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="clear-confirm-title">
          <div className="confirm-dialog">
            <div className="confirm-icon" aria-hidden="true">⚠️</div>
            <h3 id="clear-confirm-title">Clear all history?</h3>
            <p>This will permanently delete all {stats.total} audit log entries. This cannot be undone.</p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmClear(false)}
                id="clear-cancel-btn"
                disabled={clearLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleClearHistory}
                id="clear-confirm-btn"
                disabled={clearLoading}
              >
                {clearLoading ? 'Clearing…' : 'Yes, clear all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
