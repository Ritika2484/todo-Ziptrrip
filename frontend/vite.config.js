import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),    // TodoList  →  /
        todo:    resolve(__dirname, 'todo.html'),     // TodoDetail → /todo.html?id=xxx
        history: resolve(__dirname, 'history.html'),  // History   → /history.html
      },
    },
  },
});
