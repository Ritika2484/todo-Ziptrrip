const IRepository = require('./IRepository');
const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'history.json');

/**
 * HistoryRepository — Append-only store for audit log entries.
 *
 * Extends IRepository to satisfy the Liskov Substitution Principle.
 * Only findAll(), findById(), and create() are implemented —
 * history entries are never updated or deleted through normal flow.
 */
class HistoryRepository extends IRepository {
  constructor() {
    super();
    this._ensureDataFile();
  }

  _ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      console.log('[HistoryRepository] Created history.json.');
    }
  }

  _read() {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  }

  _write(entries) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8');
  }

  /** @inheritdoc */
  async findAll() {
    return this._read();
  }

  /** @inheritdoc */
  async findById(id) {
    const all = this._read();
    return all.find((h) => h.id === id) || null;
  }

  /** @inheritdoc */
  async create(entry) {
    const entries = this._read();
    const record  = { id: uuidv4(), ...entry, timestamp: new Date().toISOString() };
    entries.unshift(record); // newest first
    this._write(entries);
    return record;
  }

  /**
   * Wipe all history entries. Used by the "Clear History" endpoint.
   */
  async clear() {
    this._write([]);
  }
}

module.exports = HistoryRepository;
