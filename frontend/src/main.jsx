import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppShell  from './components/AppShell';
import TodoList  from './pages/TodoList';

/**
 * MPA entry point for the Todo List page (index.html).
 * No React Router — this page is served at "/" directly.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppShell activePage="list">
      <TodoList />
    </AppShell>
  </StrictMode>,
);
