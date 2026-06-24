import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppShell   from './components/AppShell';
import TodoDetail from './pages/TodoDetail';

/**
 * MPA entry point for the Todo Detail page (todo.html).
 * Served at "/todo.html?id=xxx". No React Router needed.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppShell activePage="detail">
      <TodoDetail />
    </AppShell>
  </StrictMode>,
);
