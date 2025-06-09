import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        expenses: resolve(__dirname, 'src/expenses.html'),
        budget: resolve(__dirname, 'src/budget.html')
      }
    }
  },
  server: {
    open: '/src/index.html'
  }
});