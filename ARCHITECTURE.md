# Architecture

Technical architecture of the Ziptrrip Todo App.

---

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                   Browser (React)                    │
│                                                      │
│  TodoList Page         TodoDetail Page               │
│      │                      │                        │
│  useTodos hook          useTodo hook                 │
│      │                      │                        │
│        api/todoApi.js (fetch)                        │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (port 3001)
┌────────────────────▼────────────────────────────────┐
│                 Express Server                        │
│                                                      │
│  routes/todos.js  →  controllers/todoController.js  │
│                              │                       │
│                  services/todoService.js             │
│                              │                       │
│            repositories/IRepository.js  (abstract)  │
│                              │                       │
│            repositories/FileRepository.js            │
│                              │                       │
│                   data/todos.json                    │
└─────────────────────────────────────────────────────┘
```

Each arrow represents a **downward dependency** — higher layers call lower layers, never the reverse.

---

## Layered Architecture

### Layer 1 — Routes (`routes/todos.js`)
Defines URL patterns and HTTP methods. Immediately delegates to the controller. Contains zero logic.

```js
router.get('/',    getAllTodos);    // maps URL to function
router.post('/',   createTodo);
router.get('/:id', getTodoById);
// ...
```

### Layer 2 — Controllers (`controllers/todoController.js`)
Extracts data from `req`, calls the service, and writes the JSON response. Contains zero business logic and zero data-access code.

```js
async function createTodo(req, res, next) {
  try {
    const todo = await todoService.createTodo(req.body);  // call service
    res.status(201).json({ success: true, data: todo });   // send response
  } catch (err) {
    next(err);                                              // forward to error handler
  }
}
```

### Layer 3 — Services (`services/todoService.js`)
Owns **all** business logic and validation. Does not know about HTTP or storage details.

```js
_validate(data, requireTitle = true) {
  if (requireTitle && !data.title?.trim()) {
    const err = new Error('Title is required.');
    err.statusCode = 400;
    throw err;
  }
  // ...
}
```

### Layer 4 — Repository (`repositories/`)
Abstracts the data source. The service layer calls `this.repository.findAll()` — it does not know whether data comes from a file or a database.

### Layer 5 — Data (`data/todos.json`)
Plain JSON file managed exclusively by `FileRepository`.

---

## Repository Pattern

### The Interface (`IRepository.js`)

```js
class IRepository {
  async findAll()        { throw new Error('Not implemented'); }
  async findById(id)     { throw new Error('Not implemented'); }
  async create(todo)     { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id)       { throw new Error('Not implemented'); }
}
```

All concrete implementations must fulfil this contract.

### The Concrete Implementation (`FileRepository.js`)

```js
class FileRepository extends IRepository {
  async findAll() {
    return this._read();                       // read todos.json
  }
  async create(todo) {
    const todos = this._read();
    todos.push(todo);
    this._write(todos);                        // write todos.json
    return todo;
  }
  // ...
}
```

### Swapping to MongoDB

To replace file storage with MongoDB:

1. Create `repositories/MongoRepository.js` that extends `IRepository`
2. Implement the same 5 methods using Mongoose / the MongoDB driver
3. In `services/todoService.js`, change one line:

```js
// Before:
module.exports = new TodoService(new FileRepository());

// After:
module.exports = new TodoService(new MongoRepository());
```

**Zero changes** are needed in routes, controllers, or the service logic itself.

---

## SOLID Principles Applied

### S — Single Responsibility Principle

Every file has exactly one reason to change:

| File | Responsibility |
|---|---|
| `server.js` | Bootstrap and wire the Express app |
| `routes/todos.js` | Define URL → handler mapping |
| `controllers/todoController.js` | Extract from `req`, send `res` |
| `services/todoService.js` | Validate input, apply business rules |
| `repositories/FileRepository.js` | Read and write `todos.json` |
| `models/Todo.js` | Define the shape of a new Todo |
| `middleware/errorHandler.js` | Map errors to HTTP responses |

**Example:** If the validation rules change, only `todoService.js` is modified.  
If the storage format changes (e.g. to SQLite), only `FileRepository.js` is modified.

---

### O — Open/Closed Principle

The system is **open for extension** and **closed for modification**.

```js
// services/todoService.js
class TodoService {
  constructor(repository) {
    this.repository = repository;   // injected — can be any IRepository
  }
}
```

Adding a `MongoRepository` **extends** the system without modifying `TodoService`.

---

### L — Liskov Substitution Principle

`FileRepository` can substitute `IRepository` anywhere without breaking the system.  
Any future `MongoRepository` must also be a safe substitute — it is enforced by extending the same base class and implementing all 5 methods.

```js
class FileRepository extends IRepository {
  async findAll()  { /* real implementation */ }
  async findById() { /* real implementation */ }
  async create()   { /* real implementation */ }
  async update()   { /* real implementation */ }
  async delete()   { /* real implementation */ }
}
```

---

### I — Interface Segregation Principle

`IRepository` declares **only the methods that are actually needed** by the service layer — no more:

```js
findAll()     // used by getAllTodos()
findById(id)  // used by getTodoById(), updateTodo(), deleteTodo()
create(todo)  // used by createTodo()
update(id, d) // used by updateTodo()
delete(id)    // used by deleteTodo()
```

No bloated "god interface" with unrelated methods.

---

### D — Dependency Inversion Principle

High-level modules (services) depend on **abstractions** (IRepository), not on concrete implementations (FileRepository).

```js
// HIGH-LEVEL: TodoService depends on the abstraction
class TodoService {
  constructor(repository) {       // IRepository shape expected
    this.repository = repository;
  }
  async createTodo(data) {
    return this.repository.create(todo);   // calls the abstraction
  }
}

// COMPOSITION ROOT: wired once at the application boundary
module.exports = new TodoService(new FileRepository());
```

`TodoService` never imports `FileRepository` directly — it receives it via **constructor injection**.

---

## Frontend Architecture

### Page Independence

Each page fetches its own data independently with no shared global state:

```
TodoList page  →  useTodos hook  →  fetchAllTodos()  →  GET /api/todos
TodoDetail page →  useTodo hook   →  fetchTodoById()  →  GET /api/todos/:id
```

### Navigation Strategy

Navigation between pages uses `window.location.href` (full page loads), not `useNavigate`. This satisfies the "multi-page" requirement — each page boot triggers its own data fetch.

```js
// In TodoCard.jsx — navigate to detail page
window.location.href = `/todo?id=${todo.id}`;

// In TodoDetail.jsx — redirect to list after delete
window.location.href = '/';

// In App.jsx + index.html — back link
<a href="/">All Todos</a>
```

### Data Flow

```
useTodos / useTodo
    │ calls
    ▼
api/todoApi.js  (pure fetch functions, no state)
    │ HTTP
    ▼
Express API  :3001
```

Props flow downward from pages → components. Callbacks flow upward from components → pages.
