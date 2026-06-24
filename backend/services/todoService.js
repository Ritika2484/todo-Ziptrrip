const { createTodo } = require('../models/Todo');
const FileRepository = require('../repositories/FileRepository');
const historyService = require('./historyService');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * TodoService — business logic and validation layer.
 *
 * SOLID — Single Responsibility Principle:
 *   Owns validation, business rules, and change-diff computation only.
 *   Delegates persistence to the repository and audit logging to historyService.
 *
 * SOLID — Dependency Inversion Principle:
 *   Depends on IRepository abstraction. Swap FileRepository → MongoRepository freely.
 */
class TodoService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Validate input fields for create/update operations.
   * @private
   */
  _validate(data, requireTitle = true) {
    const errors = [];

    if (requireTitle) {
      if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('Title is required and must be a non-empty string.');
      }
    } else if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('Title must be a non-empty string.');
      }
    }

    if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }

    if (data.dueDate !== undefined && data.dueDate !== null && data.dueDate !== '') {
      const d = new Date(data.dueDate);
      if (isNaN(d.getTime())) {
        errors.push('dueDate must be a valid ISO 8601 date string or null.');
      }
    }

    if (errors.length > 0) {
      const err = new Error(errors.join(' '));
      err.statusCode = 400;
      err.errors = errors;
      throw err;
    }
  }

  /**
   * Compute a diff between the original todo and the incoming update payload.
   * Returns an object of { field: { from, to } } for changed fields, or null.
   * @private
   */
  _computeChanges(original, updates) {
    const TRACKED = ['title', 'description', 'priority', 'completed', 'dueDate'];
    const changes = {};

    for (const field of TRACKED) {
      if (updates[field] !== undefined) {
        const from = original[field];
        const to   = updates[field];
        // Normalize null / empty-string dueDate comparison
        const normFrom = (field === 'dueDate' && from === null) ? null : from;
        const normTo   = (field === 'dueDate' && to   === '') ? null : to;
        if (normFrom !== normTo) {
          changes[field] = { from: normFrom, to: normTo };
        }
      }
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }

  /**
   * Determine the audit action type from a changes diff.
   * If only `completed` changed, use 'completed' / 'uncompleted'.
   * If other fields changed (with or without completed), use 'updated'.
   * @private
   */
  _determineAction(changes) {
    if (!changes) return 'updated';

    const fields = Object.keys(changes);
    if (fields.length === 1 && fields[0] === 'completed') {
      return changes.completed.to === true ? 'completed' : 'uncompleted';
    }
    return 'updated';
  }

  // ── Public Methods ────────────────────────────────────────────

  async getAllTodos(query = {}) {
    let todos = await this.repository.findAll();
    const { search, status, priority, sortBy, sortDir } = query;

    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      todos = todos.filter((t) => t.title.toLowerCase().includes(term));
    }

    if (status === 'active')    todos = todos.filter((t) => !t.completed);
    if (status === 'completed') todos = todos.filter((t) =>  t.completed);

    if (priority && VALID_PRIORITIES.includes(priority)) {
      todos = todos.filter((t) => t.priority === priority);
    }

    const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
    const dir = sortDir === 'desc' ? -1 : 1;

    if (sortBy === 'priority') {
      todos.sort((a, b) => dir * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]));
    } else if (sortBy === 'dueDate') {
      todos.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dir * (new Date(a.dueDate) - new Date(b.dueDate));
      });
    } else if (sortBy === 'createdAt') {
      todos.sort((a, b) => dir * (new Date(a.createdAt) - new Date(b.createdAt)));
    }

    return todos;
  }

  async getTodoById(id) {
    const todo = await this.repository.findById(id);
    if (!todo) {
      const err = new Error(`Todo with id "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }
    return todo;
  }

  async createTodo(data) {
    this._validate(data, true);

    const todo = createTodo({
      title:       data.title,
      description: data.description,
      priority:    data.priority || 'medium',
      dueDate:     data.dueDate  || null,
    });

    const saved = await this.repository.create(todo);

    // ── Audit log ──────────────────────────────────────────────
    try {
      await historyService.logAction(saved.id, saved.title, 'created', null);
    } catch (e) {
      console.warn('[History] Failed to log create action:', e.message);
    }

    return saved;
  }

  async updateTodo(id, data) {
    const original = await this.getTodoById(id);

    this._validate(data, false);

    const allowedFields = ['title', 'description', 'priority', 'completed', 'dueDate'];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }
    if (updateData.dueDate === '') updateData.dueDate = null;

    const updated = await this.repository.update(id, updateData);

    // ── Audit log ──────────────────────────────────────────────
    try {
      const changes = this._computeChanges(original, updateData);
      const action  = this._determineAction(changes);
      await historyService.logAction(updated.id, updated.title, action, changes);
    } catch (e) {
      console.warn('[History] Failed to log update action:', e.message);
    }

    return updated;
  }

  async deleteTodo(id) {
    const todo = await this.getTodoById(id);

    await this.repository.delete(id);

    // ── Audit log ──────────────────────────────────────────────
    try {
      await historyService.logAction(todo.id, todo.title, 'deleted', null);
    } catch (e) {
      console.warn('[History] Failed to log delete action:', e.message);
    }
  }

  /**
   * Toggle a todo's completed status atomically.
   * Flips true → false or false → true in a single operation.
   * Logs 'completed' or 'uncompleted' to history.
   *
   * @param {string} id
   * @returns {Promise<Object>} The updated todo
   */
  async toggleTodo(id) {
    const original = await this.getTodoById(id);
    const newState = !original.completed;

    const updated = await this.repository.update(id, { completed: newState });

    // ── Audit log ──────────────────────────────────────────────
    try {
      const action  = newState ? 'completed' : 'uncompleted';
      const changes = { completed: { from: original.completed, to: newState } };
      await historyService.logAction(updated.id, updated.title, action, changes);
    } catch (e) {
      console.warn('[History] Failed to log toggle action:', e.message);
    }

    return updated;
  }
}

module.exports = new TodoService(new FileRepository());

