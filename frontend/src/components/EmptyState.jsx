/**
 * EmptyState — Shown when no todos match the current filters.
 *
 * @param {{ hasFilters: boolean, onClear: function, onAdd: function }} props
 */
export default function EmptyState({ hasFilters, onClear, onAdd }) {
  if (hasFilters) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <div className="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>No todos match your current search or filters. Try adjusting them.</p>
        <button className="btn-secondary" onClick={onClear} id="empty-clear-filters-btn">
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon">✨</div>
      <h3>All clear!</h3>
      <p>You have no todos yet. Add your first one to get started.</p>
      <button className="btn-add" onClick={onAdd} id="empty-add-todo-btn">
        + Add your first todo
      </button>
    </div>
  );
}
