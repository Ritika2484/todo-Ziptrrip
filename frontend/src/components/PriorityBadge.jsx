/**
 * PriorityBadge — Colored pill badge for todo priority.
 *
 * @param {{ priority: 'low' | 'medium' | 'high' }} props
 */
export default function PriorityBadge({ priority }) {
  const icons = { low: '↓', medium: '→', high: '↑' };

  return (
    <span className={`priority-badge ${priority}`} aria-label={`Priority: ${priority}`}>
      <span aria-hidden="true">{icons[priority] || '→'}</span>
      {priority}
    </span>
  );
}
