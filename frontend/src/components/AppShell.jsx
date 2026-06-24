/**
 * AppShell — Shared sticky header with navigation links for all three pages.
 *
 * Since this is an MPA, navigation uses plain <a href> (full page loads).
 * The `activePage` prop controls which nav link is highlighted.
 *
 * @param {{ activePage: 'list' | 'detail' | 'history', children: React.ReactNode }} props
 */
export default function AppShell({ activePage, children }) {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="app-header-inner">
          {/* Logo */}
          <a href="/" className="app-logo" aria-label="Go to todo list">
            <div className="app-logo-icon" aria-hidden="true">✓</div>
            <span>Ziptrrip<span className="gradient-text"> Todos</span></span>
          </a>

          {/* Navigation */}
          <nav className="app-nav" aria-label="Main navigation">
            <a
              href="/"
              className={`nav-link ${activePage === 'list' ? 'active' : ''}`}
              aria-current={activePage === 'list' ? 'page' : undefined}
              id="nav-list-link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="8"  y1="6"  x2="21" y2="6"/>
                <line x1="8"  y1="12" x2="21" y2="12"/>
                <line x1="8"  y1="18" x2="21" y2="18"/>
                <line x1="3"  y1="6"  x2="3.01" y2="6"/>
                <line x1="3"  y1="12" x2="3.01" y2="12"/>
                <line x1="3"  y1="18" x2="3.01" y2="18"/>
              </svg>
              Todos
            </a>
            <a
              href="/history.html"
              className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
              aria-current={activePage === 'history' ? 'page' : undefined}
              id="nav-history-link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="12 8 12 12 14 14"/>
                <path d="M3.05 11a9 9 0 1 0 .5-4"/>
                <polyline points="3 3 3 7 7 7"/>
              </svg>
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main role="main">
        {children}
      </main>
    </div>
  );
}
