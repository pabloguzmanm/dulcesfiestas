import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Asegura que la salida sea dist/
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/components',
      '@pages': '/pages',
    },
  },
});