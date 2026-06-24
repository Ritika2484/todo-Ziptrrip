/**
 * App.jsx — No longer used in MPA mode.
 *
 * Each page now has its own entry point that renders directly into #root:
 *   index.html   → src/main.jsx       → TodoList
 *   todo.html    → src/todo-main.jsx  → TodoDetail
 *   history.html → src/history-main.jsx → History
 *
 * React Router has been removed. Navigation is handled by plain <a href> links
 * and window.location.href — satisfying the MPA multi-page requirement.
 */
export default function App() {
  return null;
}
