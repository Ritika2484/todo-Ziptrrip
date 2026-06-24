import { useState, useEffect, useRef } from 'react';

const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

/**
 * AddEditModal — Modal form for both creating and editing todos.
 *
 * When `todo` prop is provided, the form is pre-filled (edit mode).
 * When `todo` is null/undefined, the form is blank (add mode).
 *
 * @param {{
 *   todo?: Object,
 *   onSubmit: function,
 *   onClose: function,
 * }} props
 */
export default function AddEditModal({ todo, onSubmit, onClose }) {
  const isEdit = Boolean(todo);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    title:       todo?.title       || '',
    description: todo?.description || '',
    priority:    todo?.priority    || 'medium',
    dueDate:     todo?.dueDate
      ? new Date(todo.dueDate).toISOString().split('T')[0]
      : '',
  });
  const [errors,    setErrors]    = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState('');

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!PRIORITY_OPTIONS.includes(form.priority)) errs.priority = 'Select a valid priority.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      priority:    form.priority,
      dueDate:     form.dueDate || null,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Prevent clicks inside modal from closing it
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEdit ? '✏️  Edit Todo' : '✨  New Todo'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            id="modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* API-level error */}
        {apiError && (
          <div className="error-box" style={{ marginBottom: '20px' }} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-title-input">
              Title <span aria-hidden="true" style={{ color: 'var(--priority-high)' }}>*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              id="modal-title-input"
              name="title"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={200}
              aria-required="true"
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p className="form-error" id="title-error" role="alert">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-desc-input">Description</label>
            <textarea
              id="modal-desc-input"
              name="description"
              className="form-textarea"
              placeholder="Add more detail (optional)…"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Priority + Due Date row */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="modal-priority-select">Priority</label>
              <select
                id="modal-priority-select"
                name="priority"
                className="form-select"
                value={form.priority}
                onChange={handleChange}
                aria-describedby={errors.priority ? 'priority-error' : undefined}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p} style={{ textTransform: 'capitalize' }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="form-error" id="priority-error" role="alert">{errors.priority}</p>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="modal-due-input">Due Date</label>
              <input
                type="date"
                id="modal-due-input"
                name="dueDate"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
                style={{ colorScheme: 'light' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              id="modal-submit-btn"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
