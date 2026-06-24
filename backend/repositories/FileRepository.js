const fs   = require('fs');
const path = require('path');
const IRepository = require('./IRepository');

const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

/**
 * Seed todos written to todos.json when the file does not yet exist.
 */
const SEED_TODOS = [
  {
    id:          'seed-001',
    title:       'Review Ziptrrip onboarding docs',
    description: 'Read through all the onboarding material sent by HR and highlight key points.',
    priority:    'high',
    completed:   false,
    dueDate:     new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  },
  {
    id:          'seed-002',
    title:       'Set up local development environment',
    description: 'Install Node.js, clone the repo, and run npm install for both frontend and backend.',
    priority:    'high',
    completed:   true,
    dueDate:     new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  },
  {
    id:          'seed-003',
    title:       'Complete the Todo app assignment',
    description: 'Build the full-stack CRUD Todo application with SOLID architecture as described in the brief.',
    priority:    'high',
    completed:   false,
    dueDate:     new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  },
  {
    id:          'seed-004',
    title:       'Write unit tests for the service layer',
    description: 'Cover validation edge cases and ensure all business logic is tested.',
    priority:    'medium',
    completed:   false,
    dueDate:     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  },
  {
    id:          'seed-005',
    title:       'Schedule 1-on-1 with mentor',
    description: 'Book a 30-minute slot with your assigned mentor to discuss goals for the internship.',
    priority:    'low',
    completed:   false,
    dueDate:     null,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  },
];

/**
 * FileRepository — Concrete implementation of IRepository.
 *
 * SOLID — Single Responsibility Principle:
 *   All file I/O is contained exclusively in this class.
 *
 * SOLID — Open/Closed Principle:
 *   The service layer is closed for modification; swapping this class for
 *   MongoRepository requires zero changes to any service or controller.
 */
class FileRepository extends IRepository {
  constructor() {
    super();
    this._ensureDataFile();
  }

  /**
   * Ensures the data directory and todos.json exist.
   * Seeds the file with sample data if it is being created for the first time.
   * @private
   */
  _ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_TODOS, null, 2), 'utf8');
      console.log('[FileRepository] Created todos.json with seed data.');
    }
  }

  /**
   * Read and parse todos.json.
   * @private
   * @returns {Array}
   */
  _read() {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  }

  /**
   * Serialize and write todos array to disk.
   * @private
   * @param {Array} todos
   */
  _write(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
  }

  /** @inheritdoc */
  async findAll() {
    return this._read();
  }

  /** @inheritdoc */
  async findById(id) {
    const todos = this._read();
    return todos.find((t) => t.id === id) || null;
  }

  /** @inheritdoc */
  async create(todo) {
    const todos = this._read();
    todos.push(todo);
    this._write(todos);
    return todo;
  }

  /** @inheritdoc */
  async update(id, data) {
    const todos = this._read();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated = {
      ...todos[index],
      ...data,
      id,                              // id is immutable
      createdAt: todos[index].createdAt, // createdAt is immutable
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    this._write(todos);
    return updated;
  }

  /** @inheritdoc */
  async delete(id) {
    const todos = this._read();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    this._write(todos);
    return true;
  }
}

module.exports = FileRepository;
