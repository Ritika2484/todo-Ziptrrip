/**
 * IRepository — Abstract base class (interface contract) for Todo repositories.
 *
 * SOLID — Dependency Inversion Principle:
 *   Services depend on this abstraction, not on any concrete implementation.
 *   Swap FileRepository for MongoRepository without touching any service code.
 *
 * SOLID — Liskov Substitution Principle:
 *   Any concrete subclass must fulfil this contract fully so it is a safe substitute.
 */
class IRepository {
  /**
   * Retrieve all todo records.
   * @returns {Promise<Array>}
   */
  async findAll() {
    throw new Error('Not implemented');
  }

  /**
   * Retrieve a single todo by its UUID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    throw new Error('Not implemented');
  }

  /**
   * Persist a new todo record.
   * @param {Object} todo - Fully-formed todo object from the Todo factory
   * @returns {Promise<Object>} The saved todo
   */
  async create(todo) {
    throw new Error('Not implemented');
  }

  /**
   * Update an existing todo by ID.
   * @param {string} id
   * @param {Object} data - Partial update payload
   * @returns {Promise<Object>} The updated todo
   */
  async update(id, data) {
    throw new Error('Not implemented');
  }

  /**
   * Delete a todo by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Not implemented');
  }
}

module.exports = IRepository;
