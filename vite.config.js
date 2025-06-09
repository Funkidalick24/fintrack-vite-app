import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'FinTrack-Frontend/index.html'),
        expenses: resolve(__dirname, 'FinTrack-Frontend/expenses.html'),
        budget: resolve(__dirname, 'FinTrack-Frontend/budget.html')
      }
    }
  },
  server: {
    open: '/FinTrack-Frontend/index.html'
  }
});