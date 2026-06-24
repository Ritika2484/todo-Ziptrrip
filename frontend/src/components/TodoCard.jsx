import PriorityBadge from './PriorityBadge';

/**
 * Format an ISO date string for display.
 * Returns relative labels like "Today", "Tomorrow", "Overdue", or a short date.
 */
function formatDueDate(iso) {
  if (!iso) return null;
  const due   = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  const diff = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: `Overdue by ${Math.abs(diff)}d`, type: 'overdue' };
  if (diff === 0) return { label: 'Due today',    type: 'soon' };
  if (diff === 1) return { label: 'Due tomorrow', type: 'soon' };
  return {
    label: `Due in ${diff} days`,
    type: 'normal',
  };
}

/**
 * Get a matching cozy emoji based on keyword matches or ID hash.
 */
function getTaskEmoji(title, id) {
  const lower = title.toLowerCase();
  if (lower.includes('coffee') || lower.includes('tea') || lower.includes('drink')) return '☕';
  if (lower.includes('book') || lower.includes('read') || lower.includes('study')) return '📖';
  if (lower.includes('code') || lower.includes('program') || lower.includes('dev') || lower.includes('software')) return '💻';
  if (lower.includes('meditate') || lower.includes('yoga') || lower.includes('relax') || lower.includes('exercise')) return '🧘';
  if (lower.includes('plant') || lower.includes('garden') || lower.includes('flower') || lower.includes('water')) return '🌿';
  if (lower.includes('food') || lower.includes('eat') || lower.includes('cook') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast')) return '🍎';
  if (lower.includes('art') || lower.includes('paint') || lower.includes('draw') || lower.includes('design')) return '🎨';
  if (lower.includes('write') || lower.includes('blog') || lower.includes('essay') || lower.includes('journal')) return '✍️';
  if (lower.includes('clean') || lower.includes('wash') || lower.includes('tidy') || lower.includes('laundry')) return '🧹';
  if (lower.includes('shop') || lower.includes('buy') || lower.includes('grocery') || lower.includes('store')) return '🛒';
  if (lower.includes('sleep') || lower.includes('bed') || lower.includes('rest')) return '🛌';
  if (lower.includes('walk') || lower.includes('run') || lower.includes('jog') || lower.includes('gym')) return '🚶';
  if (lower.includes('cat') || lower.includes('dog') || lower.includes('pet') || lower.includes('animal')) return '🐾';
  if (lower.includes('call') || lower.includes('phone') || lower.includes('meet') || lower.includes('talk')) return '📞';
  if (lower.includes('music') || lower.includes('song') || lower.includes('listen')) return '🎵';
  if (lower.includes('movie') || lower.includes('film') || lower.includes('show') || lower.includes('watch')) return '🍿';
  if (lower.includes('mail') || lower.includes('email') || lower.includes('letter')) return '✉️';
  if (lower.includes('key') || lower.includes('lock')) return '🔑';
  if (lower.includes('idea') || lower.includes('think') || lower.includes('brainstorm')) return '💡';
  if (lower.includes('time') || lower.includes('schedule') || lower.includes('clock') || lower.includes('alarm')) return '⏰';
  
  // stable hash fallback
  const emojis = ['🌱', '☀️', '🌸', '🍵', '🎈', '🧸', '🍪', '👒', '🚲', '⛱️', '🕯️', '✏️', '🏡', '🎒', '🧩'];
  const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % emojis.length;
  return emojis[index];
}


/**
 * TodoCard — A single todo row in the list.
 *
 * @param {{
 *   todo: Object,
 *   onToggle: function,
 *   onEdit: function,
 *   onDelete: function,
 * }} props
 */
export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const due = formatDueDate(todo.dueDate);

  const cardClasses = [
    'todo-card',
    todo.completed ? 'completed' : '',
    `priority-${todo.priority}`,
  ].filter(Boolean).join(' ');

  function handleCardClick(e) {
    // MPA navigation — fresh page load to the detail HTML page
    window.location.href = `/todo.html?id=${todo.id}`;
  }

  function handleToggle(e) {
    e.stopPropagation();
    onToggle(todo.id);
  }

  function handleEdit(e) {
    e.stopPropagation();
    onEdit(todo);
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(todo.id);
  }

  return (
    <article
      className={cardClasses}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Todo: ${todo.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(e); }}
    >
      {/* Toggle switch — pill slider for completed status */}
      <button
        className={`toggle-switch ${todo.completed ? 'on' : 'off'}`}
        onClick={handleToggle}
        id={`todo-toggle-${todo.id}`}
        aria-pressed={todo.completed}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as complete'}
        title={todo.completed ? 'Mark as active' : 'Mark as complete'}
        role="switch"
      >
        <span className="toggle-knob" aria-hidden="true" />
      </button>

      {/* Emoji Avatar */}
      <div className="todo-avatar-area" aria-hidden="true">
        {getTaskEmoji(todo.title, todo.id)}
      </div>

      {/* Content */}
      <div className="todo-card-body">
        <div className="todo-title-row">
          <span className="todo-title">{todo.title}</span>
        </div>
        <div className="todo-meta">
          {todo.description && (
            <span className="todo-desc">{todo.description}</span>
          )}
          {due && (
            <span className={`todo-due ${due.type}`} aria-label={due.label}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              {due.label}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons — visible on card hover */}
      <div className="todo-card-actions" role="group" aria-label="Todo actions">
        <button
          className="action-btn edit"
          onClick={handleEdit}
          id={`todo-edit-${todo.id}`}
          aria-label="Edit todo"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="action-btn delete"
          onClick={handleDelete}
          id={`todo-delete-${todo.id}`}
          aria-label="Delete todo"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </article>
  );
}
