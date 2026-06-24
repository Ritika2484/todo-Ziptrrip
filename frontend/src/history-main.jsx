import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppShell from './components/AppShell';
import History  from './pages/History';

/**
 * MPA entry point for the History page (history.html).
 * Served at "/history.html". No React Router needed.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppShell activePage="history">
      <History />
    </AppShell>
  </StrictMode>,
);
