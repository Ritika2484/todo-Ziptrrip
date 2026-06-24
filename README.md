# Ziptrrip Todo App

A full-stack CRUD Todo application built for the Ziptrrip internship assignment. Features a **Node.js + Express** REST API with file-based storage and a **React + Vite** frontend with a premium dark-mode UI.

---

## Features

### Frontend
- View all todos in a beautiful dark-mode card list
- Real-time search by title (debounced 300ms)
- Filter by status: All / Active / Completed
- Filter by priority: All / High / Medium / Low
- Sort by: Date Created / Due Date / Priority (ascending or descending)
- Add todo via animated modal form
- Edit todo via same modal (pre-filled)
- Delete todo with confirmation dialog
- Toggle complete / incomplete per card
- Priority colour-coded left-bar and badge on each card
- Overdue / Due soon date labels
- Click any card → navigate to full detail page
- Detail page: all fields shown, edit, toggle, delete, back button
- Stats summary chips (total, active, completed, high-priority count)
- Loading spinner, empty state, and error state on every data boundary

### Backend
- `POST /api/todos` — Create a todo
- `GET  /api/todos` — Get all todos (with `?search`, `?status`, `?priority`, `?sortBy`, `?sortDir`)
- `GET  /api/todos/:id` — Get single todo
- `PUT  /api/todos/:id` — Update todo (partial)
- `DELETE /api/todos/:id` — Delete todo
- Input validation (title required, priority enum, date format)
- UUID-based IDs, ISO timestamps
- File-based storage (`data/todos.json`), auto-created with seed data
- SOLID architecture: Routes → Controllers → Services → Repository → Data
- Centralised error middleware (400 / 404 / 500)
- CORS enabled for `http://localhost:3000`

---

## Setup & Run

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later

### 1 — Clone / open the project

```bash
cd todo
```

### 2 — Start the backend

```bash
cd backend
npm install
node server.js
```

The API will be available at **http://localhost:3001**.  
`data/todos.json` is created automatically with 5 seed todos on first run.

### 3 — Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:3000**.

---

## Folder Structure

```
todo/
├── backend/
│   ├── server.js                   ← Bootstrap: Express, middleware, routes
│   ├── routes/
│   │   └── todos.js                ← Endpoint definitions only
│   ├── controllers/
│   │   └── todoController.js       ← req/res handling only
│   ├── services/
│   │   └── todoService.js          ← Business logic + validation
│   ├── repositories/
│   │   ├── IRepository.js          ← Abstract interface (throws "Not implemented")
│   │   └── FileRepository.js       ← Concrete file I/O implementation
│   ├── models/
│   │   └── Todo.js                 ← createTodo() factory function
│   ├── middleware/
│   │   └── errorHandler.js         ← Centralised error → HTTP mapping
│   └── data/
│       └── todos.json              ← Auto-created file storage
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js              ← Dev server on port 3000
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 ← BrowserRouter + routes
│       ├── index.css               ← Full design system
│       ├── api/
│       │   └── todoApi.js          ← All fetch calls (base: :3001)
│       ├── hooks/
│       │   ├── useTodos.js         ← List page state
│       │   └── useTodo.js          ← Detail page state
│       ├── pages/
│       │   ├── TodoList.jsx        ← Route "/"
│       │   └── TodoDetail.jsx      ← Route "/todo?id=..."
│       └── components/
│           ├── TodoCard.jsx
│           ├── AddEditModal.jsx
│           ├── FilterBar.jsx
│           ├── PriorityBadge.jsx
│           └── EmptyState.jsx
│
├── README.md
├── FEATURES.md
├── API_DOCUMENTATION.md
└── ARCHITECTURE.md
```

---

## API Base URL

```
http://localhost:3001/api/todos
```

See `API_DOCUMENTATION.md` for full endpoint reference.
