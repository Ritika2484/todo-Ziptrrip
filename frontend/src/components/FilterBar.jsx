import { useRef, useEffect } from 'react';

const STATUS_OPTIONS   = [
  { value: 'all',       label: 'All Status' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'high',   label: '↑ High' },
  { value: 'medium', label: '→ Medium' },
  { value: 'low',    label: '↓ Low' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate',   label: 'Due Date' },
  { value: 'priority',  label: 'Priority' },
];

/**
 * FilterBar — Search, status tabs, priority filter, and sort controls.
 *
 * @param {{
 *   search: string,
 *   onSearchChange: function,
 *   statusFilter: string,
 *   onStatusChange: function,
 *   priorityFilter: string,
 *   onPriorityChange: function,
 *   sortBy: string,
 *   onSortByChange: function,
 *   sortDir: string,
 *   onSortDirToggle: function,
 * }} props
 */
export default function FilterBar({
  search, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
  sortBy, onSortByChange,
  sortDir, onSortDirToggle,
}) {
  const searchRef = useRef(null);

  // Debounce search: update parent 300ms after user stops typing
  const debounceTimer = useRef(null);
  function handleSearchInput(e) {
    const val = e.target.value;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => onSearchChange(val), 300);
    // Keep input visually in sync immediately
    searchRef.current.value = val;
  }

  // Sync controlled value on mount only
  useEffect(() => {
    if (searchRef.current) searchRef.current.value = search;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="filter-bar" role="search" aria-label="Filter and sort todos">

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
          placeholder="Search todos by title…"
          defaultValue={search}
          onChange={handleSearchInput}
          id="filter-search-input"
          aria-label="Search todos"
        />
      </div>

      {/* Controls row */}
      <div className="filter-controls">
        {/* Status tabs */}
        <div className="tab-group" role="tablist" aria-label="Status filter">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={statusFilter === value}
              className={`tab-btn ${statusFilter === value ? 'active' : ''}`}
              onClick={() => onStatusChange(value)}
              id={`status-tab-${value}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Priority select */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          id="filter-priority-select"
          aria-label="Filter by priority"
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Sort controls */}
        <div className="sort-controls" aria-label="Sort options">
          <span className="sort-label">Sort:</span>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            id="filter-sort-by-select"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            className="sort-dir-btn"
            onClick={onSortDirToggle}
            title={sortDir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'}
            aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}`}
            id="filter-sort-dir-btn"
          >
            {sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
