import { useState } from 'react';
import useTodos     from '../hooks/useTodos';
import TodoCard     from '../components/TodoCard';
import FilterBar    from '../components/FilterBar';
import AddEditModal from '../components/AddEditModal';
import EmptyState   from '../components/EmptyState';
import CozyCharacter from '../components/CozyCharacter';

/**
 * TodoList — Page 1, route "/".
 *
 * Features:
 *  - Fetches all todos on mount (independent data ownership)
 *  - Client-side search, filter by status/priority, sort
 *  - Add todo via AddEditModal
 *  - Edit todo via AddEditModal (pre-filled)
 *  - Delete with confirmation
 *  - Toggle complete/incomplete
 *  - Click card → window.location.href = /todo?id=xxx (fresh page load)
 *  - Loading, error, and empty states
 */
export default function TodoList() {
  const {
    todos, loading, error, stats,
    search,         setSearch,
    statusFilter,   setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy,         setSortBy,
    sortDir,        setSortDir,
    addTodo, editTodo, removeTodo, toggleTodo,
  } = useTodos();

  const [modalOpen,    setModalOpen]    = useState(false);
  const [editingTodo,  setEditingTodo]  = useState(null);   // null = add mode
  const [confirmId,    setConfirmId]    = useState(null);   // id being confirmed for delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────

  function openAddModal() {
    setEditingTodo(null);
    setModalOpen(true);
  }

  function openEditModal(todo) {
    setEditingTodo(todo);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTodo(null);
  }

  async function handleModalSubmit(payload) {
    if (editingTodo) {
      await editTodo(editingTodo.id, payload);
    } else {
      await addTodo(payload);
    }
  }

  function requestDelete(id) {
    setConfirmId(id);
  }

  async function confirmDelete() {
    if (!confirmId) return;
    try {
      setDeleteLoading(true);
      await removeTodo(confirmId);
    } finally {
      setDeleteLoading(false);
      setConfirmId(null);
    }
  }

  function cancelDelete() {
    setConfirmId(null);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all';

  // ── Render ────────────────────────────────────────────────────

  return (
    <main className="page-container" id="todo-list-page">

      {/* Page heading + Add button */}
      <div className="page-title-block">
        <div className="title-row">
          <div>
            <h1>
              My <span className="handwritten-word">Todos</span>
            </h1>
            <p className="page-subtitle">Stay organised. Get things done.</p>
          </div>
          <button
            className="btn-add"
            onClick={openAddModal}
            id="open-add-modal-btn"
            aria-label="Add a task"
          >
            <span>✏️</span> Add a Task
          </button>
        </div>
      </div>

      {/* Stats tiles */}
      {!loading && !error && (
        <>
          <div className="stats-row" aria-label="Todo statistics">
            <div className="stat-card total">
              <div className="stat-icon">📌</div>
              <div className="stat-content">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-number">{stats.active}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">🎉</div>
              <div className="stat-content">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            {stats.high > 0 && (
              <div className="stat-card high-priority">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <span className="stat-number">{stats.high}</span>
                  <span className="stat-label">Urgent</span>
                </div>
              </div>
            )}
          </div>

          {/* Animated Cozy Cat Character */}
          <CozyCharacter activeCount={stats.active} totalCount={stats.total} />
        </>
      )}

      {/* Filter bar */}
      {!loading && !error && (
        <FilterBar
          search={search}            onSearchChange={setSearch}
          statusFilter={statusFilter}   onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
          sortBy={sortBy}            onSortByChange={setSortBy}
          sortDir={sortDir}          onSortDirToggle={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
        />
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-wrapper" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">Loading your todos…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="error-box" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p><strong>Failed to load todos</strong></p>
            <p>{error}</p>
            <p style={{ marginTop: '8px', fontSize: '0.82rem' }}>
              Make sure the backend is running on <code>http://localhost:3001</code>.
            </p>
          </div>
        </div>
      )}

      {/* Todo list */}
      {!loading && !error && (
        <>
          {todos.length === 0 ? (
            <EmptyState
              hasFilters={Boolean(hasFilters)}
              onClear={clearFilters}
              onAdd={openAddModal}
            />
          ) : (
            <ul className="todo-list" aria-label="Todo items" style={{ listStyle: 'none', padding: 0 }}>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <TodoCard
                    todo={todo}
                    onToggle={toggleTodo}
                    onEdit={openEditModal}
                    onDelete={requestDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <AddEditModal
          todo={editingTodo}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}

      {/* Delete confirmation dialog */}
      {confirmId && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="confirm-dialog">
            <div className="confirm-icon" aria-hidden="true">🗑️</div>
            <h3 id="confirm-title">Delete this todo?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={cancelDelete}
                id="confirm-cancel-btn"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                id="confirm-delete-btn"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
