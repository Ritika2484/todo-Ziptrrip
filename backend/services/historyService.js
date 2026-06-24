const HistoryRepository = require('../repositories/HistoryRepository');

const VALID_ACTIONS = ['created', 'updated', 'completed', 'uncompleted', 'deleted'];

/**
 * HistoryService — Business logic for the audit log.
 *
 * Responsibilities:
 *   - Log an action against a todo
 *   - Retrieve and filter history entries
 *   - Clear all history
 *
 * SOLID — Single Responsibility:
 *   Contains only history-domain logic. No knowledge of HTTP or file paths.
 */
class HistoryService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Persist one audit log entry.
   *
   * @param {string} todoId
   * @param {string} todoTitle
   * @param {'created'|'updated'|'completed'|'uncompleted'|'deleted'} action
   * @param {Object|null} changes  — diff object or null
   * @returns {Promise<Object>}
   */
  async logAction(todoId, todoTitle, action, changes = null) {
    if (!VALID_ACTIONS.includes(action)) {
      throw new Error(`Invalid history action: "${action}"`);
    }

    return this.repository.create({
      todoId,
      todoTitle,
      action,
      changes,
    });
  }

  /**
   * Retrieve all history entries with optional filtering.
   *
   * @param {Object} query  — { action, search, todoId, limit }
   * @returns {Promise<Array>}
   */
  async getAllHistory(query = {}) {
    let entries = await this.repository.findAll();
    const { action, search, todoId, limit } = query;

    if (action && VALID_ACTIONS.includes(action)) {
      entries = entries.filter((e) => e.action === action);
    }

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      entries = entries.filter((e) =>
        e.todoTitle && e.todoTitle.toLowerCase().includes(term)
      );
    }

    if (todoId) {
      entries = entries.filter((e) => e.todoId === todoId);
    }

    if (limit && Number.isInteger(Number(limit))) {
      entries = entries.slice(0, Number(limit));
    }

    return entries;
  }

  /**
   * Retrieve history for a specific todo.
   * @param {string} todoId
   * @returns {Promise<Array>}
   */
  async getHistoryByTodoId(todoId) {
    return this.getAllHistory({ todoId });
  }

  /**
   * Wipe all history entries.
   * @returns {Promise<void>}
   */
  async clearHistory() {
    await this.repository.clear();
  }
}

// Singleton — shared across the entire app
module.exports = new HistoryService(new HistoryRepository());
