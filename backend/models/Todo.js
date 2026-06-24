const { v4: uuidv4 } = require('uuid');

/**
 * Todo factory function.
 * Creates a new Todo object with all fields and sensible defaults.
 *
 * @param {Object} data - Partial todo data provided by the client
 * @returns {Object} A fully-formed Todo object
 */
function createTodo(data) {
  const now = new Date().toISOString();

  return {
    id:          uuidv4(),
    title:       data.title.trim(),
    description: data.description !== undefined ? String(data.description).trim() : '',
    priority:    data.priority    || 'medium',
    completed:   false,
    dueDate:     data.dueDate     || null,
    createdAt:   now,
    updatedAt:   now,
  };
}

module.exports = { createTodo };
