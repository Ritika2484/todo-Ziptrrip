# Features

Comprehensive feature list for the Ziptrrip Todo App.

---

## Frontend Features

### TodoList Page (`/`)

| Feature | Description |
|---|---|
| **Fetch on mount** | Calls `GET /api/todos` independently when the page loads |
| **Real-time search** | Debounced (300ms) client-side title search via `FilterBar` |
| **Status filter** | Tab group: All / Active / Completed |
| **Priority filter** | Dropdown: All / High / Medium / Low |
| **Sort by** | Dropdown: Date Created / Due Date / Priority |
| **Sort direction** | Toggle button: ascending ↑ / descending ↓ |
| **Add todo** | Opens `AddEditModal` in add mode (blank form) |
| **Edit todo** | Opens `AddEditModal` in edit mode (pre-filled from todo data) |
| **Delete todo** | Triggers confirmation dialog before removal |
| **Toggle complete** | Checkbox on each card toggles `completed` and updates API |
| **Navigate to detail** | Clicking a card body navigates via `window.location.href = /todo?id=...` |
| **Stats chips** | Shows total / active / completed / high-priority counts |
| **Priority left-bar** | Colour-coded vertical bar on each card (green/amber/red) |
| **Due date labels** | "Overdue by Nd", "Due today", "Due tomorrow", or short date |
| **Loading state** | Animated spinner while fetching |
| **Empty state** | Two modes: no todos (add CTA) and no filter results (clear CTA) |
| **Error state** | Error box with backend URL hint |

### TodoDetail Page (`/todo?id=...`)

| Feature | Description |
|---|---|
| **ID from URL** | Reads `?id=` via `URLSearchParams` — no React Router params |
| **Independent fetch** | Calls `GET /api/todos/:id` on mount with no shared state |
| **Display all fields** | ID, title, description, priority badge, status badge, created, updated, due |
| **Edit inline** | Opens `AddEditModal` pre-filled; updates local state on save |
| **Delete** | Confirmation dialog → delete → `window.location.href = /` |
| **Toggle complete** | Dedicated button switches Active ↔ Completed |
| **Back button** | `<a href="/">` for a fresh page load back to the list |
| **Loading state** | Full-page spinner |
| **Error state** | Error box with context (missing ID, not found, etc.) |

### Components

| Component | Description |
|---|---|
| `TodoCard` | Single todo row with checkbox, title, priority badge, due date, edit/delete hover actions |
| `AddEditModal` | Animated modal with title, description, priority select, date picker; client validation + API error display |
| `FilterBar` | Search input, status tabs, priority dropdown, sort controls |
| `PriorityBadge` | Coloured pill with directional icon (↑ high, → medium, ↓ low) |
| `EmptyState` | Contextual empty screen with CTA |

---

## Backend Features

| Feature | Description |
|---|---|
| `POST /api/todos` | Creates a todo; validates title, priority, dueDate |
| `GET /api/todos` | Returns all todos; supports `?search`, `?status`, `?priority`, `?sortBy`, `?sortDir` |
| `GET /api/todos/:id` | Returns single todo by UUID; 404 if not found |
| `PUT /api/todos/:id` | Partial update; validates provided fields; `id` and `createdAt` are immutable |
| `DELETE /api/todos/:id` | Deletes by UUID; 404 if not found |
| **UUID generation** | Every new todo gets a unique v4 UUID |
| **Timestamps** | `createdAt` and `updatedAt` (ISO 8601) on every todo |
| **Defaults** | `completed: false`, `priority: 'medium'`, `dueDate: null` |
| **Input validation** | Title required, priority enum, ISO date format check; 400 with error messages |
| **File storage** | `data/todos.json` auto-created with seed data on first run |
| **Seed data** | 5 sample todos across priorities and statuses |
| **Error middleware** | Maps `statusCode` to 400/404/500; surfaces `errors` arrays |
| **CORS** | Configured for `http://localhost:3000` |
| **Health check** | `GET /health` returns `{ status: "ok", timestamp }` |
| **SOLID architecture** | Each layer has a single, well-defined responsibility |
| **Repository Pattern** | `FileRepository` implements `IRepository`; swap without touching services |

---

## Bonus Features ⭐

| Feature | Description |
|---|---|
| ⭐ **Dark mode UI** | Premium glassmorphism design system with indigo-violet gradient |
| ⭐ **Micro-animations** | Fade-up, card hover lift, modal scale-in, staggered list entrance |
| ⭐ **Stats summary** | Live chips showing total / active / completed / high-priority counts |
| ⭐ **Overdue labels** | Cards and detail page show relative due date with colour coding |
| ⭐ **Seed data** | First run immediately shows a populated, realistic app |
| ⭐ **Health endpoint** | `GET /health` for easy backend verification |
| ⭐ **Keyboard accessibility** | Escape closes modal; ARIA roles on all interactive elements |
| ⭐ **Priority left-bar** | Visual indicator on each card without needing to read the badge |
| ⭐ **Responsive layout** | Works cleanly on mobile, tablet, and desktop |
| ⭐ **Form focus management** | Modal auto-focuses first field on open |
