import { useState } from 'react';
import useTodo      from '../hooks/useTodo';
import PriorityBadge from '../components/PriorityBadge';
import AddEditModal  from '../components/AddEditModal';

/**
 * Format ISO date string to a readable format.
 */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/**
 * TodoDetail — Page 2, route "/todo".
 *
 * Reads ?id= from URLSearchParams (NOT from React Router params).
 * Fetches the todo independently on mount.
 * Navigation back to list uses window.location.href = "/".
 *
 * Features:
 *  - Display all todo fields
 *  - Edit via AddEditModal (pre-filled)
 *  - Delete → redirect to /
 *  - Toggle complete/incomplete
 *  - Back button
 *  - Loading, error states
 */
export default function TodoDetail() {
  // ── Read ID from URL query param ──────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id') || '';

  const { todo, loading, error, editTodo, toggleTodo, removeTodo } = useTodo(id);

  const [modalOpen,    setModalOpen]    = useState(false);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState('');

  // ── Handlers ──────────────────────────────────────────────────

  async function handleToggle() {
    try {
      setActionLoading(true);
      setActionError('');
      await toggleTodo();
    } catch (err) {
      setActionError(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleModalSubmit(payload) {
    await editTodo(payload);
  }

  async function handleDelete() {
    try {
      setActionLoading(true);
      await removeTodo();
      // Fresh page load redirect to list
      window.location.href = '/';
    } catch (err) {
      setActionError(err.message || 'Failed to delete todo.');
      setActionLoading(false);
      setConfirmOpen(false);
    }
  }

  // ── Render: Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <main className="page-container" id="todo-detail-page">
        <div className="loading-wrapper" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">Loading todo…</p>
        </div>
      </main>
    );
  }

  // ── Render: Error ─────────────────────────────────────────────
  if (error || !todo) {
    return (
      <main className="page-container" id="todo-detail-page">
        <div className="detail-header">
          <a href="/" className="back-btn" id="detail-back-btn" aria-label="Back to list">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </a>
        </div>
        <div className="error-box" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p><strong>{error || 'Todo not found'}</strong></p>
            {!id && <p>No ID was provided in the URL (<code>?id=...</code>).</p>}
          </div>
        </div>
      </main>
    );
  }

  // ── Render: Detail view ───────────────────────────────────────
  return (
    <main className="page-container" id="todo-detail-page">

      {/* Back button */}
      <div className="detail-header">
        <a href="/" className="back-btn" id="detail-back-btn" aria-label="Back to todo list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          All Todos
        </a>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {todo.completed ? '✓ Completed' : '● Active'}
        </span>
      </div>

      {/* Main detail card */}
      <article className="detail-card">
        {/* Title */}
        <h1 className={`detail-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </h1>

        {/* Badges */}
        <div className="detail-badges">
          <PriorityBadge priority={todo.priority} />
          <span className={`status-badge ${todo.completed ? 'completed' : 'active'}`}>
            {todo.completed ? '✓ Completed' : '● Active'}
          </span>
        </div>

        {/* Description */}
        <p className={`detail-description ${!todo.description ? 'empty' : ''}`}>
          {todo.description || 'No description provided.'}
        </p>

        {/* Meta grid */}
        <div className="detail-meta-grid">
          <div className="meta-item">
            <span className="meta-label">ID</span>
            <span className="meta-value id-value">{todo.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Due Date</span>
            <span className="meta-value">{formatDate(todo.dueDate)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created</span>
            <span className="meta-value">{formatDate(todo.createdAt)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Last Updated</span>
            <span className="meta-value">{formatDate(todo.updatedAt)}</span>
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="error-box" style={{ marginBottom: '20px' }} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8"  x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{actionError}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="detail-actions">
          <button
            className="btn-primary"
            onClick={() => setModalOpen(true)}
            disabled={actionLoading}
            id="detail-edit-btn"
            aria-label="Edit this todo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>

          <button
            className="btn-toggle"
            onClick={handleToggle}
            disabled={actionLoading}
            id="detail-toggle-btn"
            aria-label={todo.completed ? 'Mark as active' : 'Mark as complete'}
          >
            {todo.completed ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9"  y1="9" x2="15" y2="15"/>
                </svg>
                Mark Active
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Mark Complete
              </>
            )}
          </button>

          <button
            className="btn-danger"
            onClick={() => setConfirmOpen(true)}
            disabled={actionLoading}
            id="detail-delete-btn"
            aria-label="Delete this todo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
            Delete
          </button>
        </div>
      </article>

      {/* Edit Modal */}
      {modalOpen && (
        <AddEditModal
          todo={todo}
          onSubmit={handleModalSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Delete confirmation */}
      {confirmOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="confirm-dialog">
            <div className="confirm-icon" aria-hidden="true">🗑️</div>
            <h3 id="confirm-title">Delete this todo?</h3>
            <p>This cannot be undone. You will be redirected to the list.</p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmOpen(false)}
                id="confirm-cancel-btn"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                id="confirm-delete-btn"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
