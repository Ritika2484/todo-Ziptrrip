# Ziptrrip Todo App

A complete full-stack Multi-Page Application (MPA) Todo app built for the Ziptrrip assignment. Features a RESTful Node.js/Express backend with SOLID architecture and a redesigned, mobile-inspired React+Vite frontend with an interactive dashboard and detailed activity history.

---

## Redesigned UI & Dashboard Features

The application's home page has been transformed into a side-by-side mockup-inspired **Dual-Panel Dashboard** (desktop view) that stacks responsively into an optimized vertical layout on mobile devices.

### Left Panel (Mockup Screen 1)
- **Logo-Free Clean Header**: Displays the `"Todos APP"` title, a system-aware `ThemeToggle`, and the `"Add Todo"` button.
- **Search Pill & Collapsible Filters**: 
  - Redesigned search input formatted as a clean, rounded pill.
  - A high-contrast circular black slider button that expands and collapses a custom filter panel for status (All/Active/Completed), priority (All/High/Medium/Low), and sorting.
- **Priority Quick-Filter Cards (Categories)**:
  - Three horizontally scrolling, rounded category cards displaying current active tasks under **High**, **Medium**, and **Low** priorities.
  - Features custom inline vector SVG illustrations representing users and completion.
  - Clicking any card instantly toggles the priority filter on the active list.
- **Ongoing Tasks List**:
  - Displays uncompleted, active tasks.
  - Card designs have rounded corners (`24px`), clock due-date metadata, custom circular checkboxes, and priority-specific pastel background colors (rose/lavender for High, yellow/beige for Medium, and mint green for Low).
  - Hovering over cards displays quick Edit and Delete icon trays.

### Right Panel (Mockup Screen 2)
- **Today's Overview**: Title showing the targeted date (e.g. `"June 25"`) and the number of remaining active tasks.
- **Dedicated History Icon**: A notepad/history icon in a beige circle that navigates to the dedicated Activity History page (`/history.html`).
- **Interactive Weekly Calendar Strip**:
  - Dynamically renders a 7-day calendar capsule centered around the current date.
  - Today's date is highlighted inside a high-contrast black capsule with a bottom dot indicator.
  - Other date capsules are fully clickable, allowing users to instantly filter the schedule by that due date.
- **Timeline Schedule**:
  - A vertical hourly timeline (`09:00 AM`, `11:00 AM`, `01:00 PM`...) that maps tasks due on the selected day to their nearest time slot, enabling clean scheduling.

---

## Complete Features & Functionalities

### Frontend Page-by-Page Features

#### 1. TodoList Page (`/` / `index.html`) — Dashboard View
| Feature | Description |
|---|---|
| Side-by-side Layout | Redesigned into a dual-panel layout on desktop (Left Panel: filters/categories/tasks, Right Panel: calendar/timeline). Stacks responsively on mobile. |
| Search Pill | Compact search input field shaped as a pill with a clear button. |
| Collapsible Filters | Circular slider toggle button reveals a panel to filter by status, priority, and sorting. |
| Category Cards | Three cards showing tasks count under High, Medium, and Low priorities, with custom vector SVGs. Toggles active filter on click. |
| Interactive Weekly Strip | Row of 7 calendar date capsules centered around today. Highlights today and filters the schedule when other capsules are clicked. |
| Timeline Scheduler | Vertical hourly block mapping tasks due on the selected day to their nearest time slot (`09:00 AM`, `11:00 AM`...). |
| Overdue Flagging | Todo cards style dynamically with priority-specific pastel colors and clock icons for due dates. |
| Toggle Status | Circular checkbox toggles complete/incomplete. |
| Modals | Create and edit tasks inside responsive dialog overlays. |
| Multi-Page Nav | Simple HTML links navigate across pages with zero shared memory/state. |

#### 2. TodoDetail Page (`/todo?id=xxx` / `todo.html`)
| Feature | Description |
|---|---|
| Deep-linking | Reads specific todo ID from query parameters to fetch data independently on mount. |
| Dashboard Metadata | Details rendered in a clean grid showing title, description, priority badge, status, and creation/update timestamps. |
| ID Clipboard Copier | Formats UUID as short string with a click-to-copy trigger providing checkmark animation feedback. |
| Collapsible History Log | Timeline showing only creation ("Created") and completion ("Completed") events, eliminating minor updates. |
| Modify/Delete Triggers | Edit button opens pre-filled form modal, and delete button includes double confirmation overlays. |

#### 3. Activity History Page (`/history.html` / `history`)
| Feature | Description |
|---|---|
| Standalone Page | Dedicated Page 3 mapping all global task addition and completion timelines. |
| Category Tab Filters | Toggle views between **Todos Added** (created events) and **Completed Todos** (updated events where `completed` changed to `true`). |
| Detailed Logs | Each event renders with custom badge icons, formatted locale times, and back-links to specific task details. |

---

### Backend Features & Architecture

#### API Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/todos` | `POST` | Create a new todo item |
| `/api/todos` | `GET` | Get all todos (supports search, status, and priority query filtering and sorting) |
| `/api/todos/:id` | `GET` | Get a single todo by ID |
| `/api/todos/:id` | `PUT` | Update a todo and records its changes to history |
| `/api/todos/:id` | `DELETE` | Delete a todo |
| `/api/todos/history` | `GET` | Get global timeline log of all events across todos, sorted newest-first |
| `/api/todos/:id/history` | `GET` | Get historical events for a single todo |
| `/health` | `GET` | Simple JSON ping health check response |

#### Architecture & SOLID Principles
- **SOLID Clean Layers**: Routes → Controllers → Services → Repositories pattern.
- **Repository Pattern**: `IRepository` abstract interface and concrete `FileRepository` implementation isolating JSON I/O.
- **Change Tracker Diffing**: Automatically tracks field-level edits during `PUT` updates to build exact timeline change maps.
- **JSON Persistence**: Reads and writes to `backend/data/todos.json` (automatically initializes database directory and blank seed if missing).
- **Error Middleware**: Centralized error mapping custom subclasses (`ValidationError` for 400, `NotFoundError` for 404) to HTTP statuses.

---

## Bonus Features
- **Dark Mode Toggle**: System-aware light/dark toggle with `localStorage` persistence and flash-prevention.
- **Visual Overdue Flags**: Highlight overdue tasks with warning borders and labels.
- **Interactive Segment Controls**: Category pills act as toggles, and weekly strip acts as timeline date filter.
- **Circular Checkboxes**: Styled check buttons matching custom design mockup screens.

---

## Setup & Run Instructions

### Prerequisites

- Node.js v18+ (ES Modules support required)
- npm v9+

### 1. Clone / Open Project

```bash
cd /path/to/project
```

### 2. Start the Backend

```bash
cd backend
npm install       # Install dependencies (only needed once)
node server.js    # Start the API server
```

The backend runs at: **http://localhost:3001**

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install       # Install dependencies (only needed once)
npm run dev       # Start Vite dev server
```

The frontend runs at: **http://localhost:5173** (or the next available port)

### 4. Open the App

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

**Note:** Both servers must be running simultaneously. The `backend/data/todos.json` file is auto-created on first run.

---

## Folder Structure

```
project-root/
├── backend/
│   ├── server.js                  ← Entry point: bootstraps Express
│   ├── routes/todos.js            ← HTTP route definitions only
│   ├── controllers/todoController.js ← req/res handling only
│   ├── services/todoService.js    ← Business logic & validation
│   ├── repositories/
│   │   ├── IRepository.js         ← Abstract interface (throws "Not implemented")
│   │   └── FileRepository.js      ← Concrete JSON file storage implementation
│   ├── models/Todo.js             ← createTodo() factory function
│   ├── middleware/errorHandler.js  ← Centralized error middleware
│   ├── data/todos.json            ← JSON data store (auto-created)
│   └── package.json
│
├── frontend/
│   ├── index.html                 ← Page 1 input (List/Dashboard)
│   ├── todo.html                  ← Page 2 input (Detail)
│   ├── history.html               ← Page 3 input (Activity History)
│   ├── vite.config.js             ← MPA configuration specifying entries
│   └── src/
│       ├── api/todoApi.js         ← All backend fetch calls
│       ├── hooks/
│       │   ├── useTodos.js        ← List page state hook
│       │   └── useTodo.js         ← Detail page state hook
│       ├── pages/
│       │   ├── TodoList.jsx       ← Component for Page 1
│       │   ├── TodoDetail.jsx     ← Component for Page 2
│       │   ├── HistoryPage.jsx    ← Component for Page 3
│       │   ├── list-main.jsx      ← Mount entry for Page 1
│       │   ├── detail-main.jsx    ← Mount entry for Page 2
│       │   └── history-main.jsx   ← Mount entry for Page 3
│       ├── components/
│       │   ├── TodoCard.jsx
│       │   ├── AddEditModal.jsx
│       │   ├── ThemeToggle.jsx
│       │   └── PriorityBadge.jsx
│       └── index.css              ← Full design system & pastel layouts
│
├── README.md
├── API_DOCUMENTATION.md
└── ARCHITECTURE.md
```
