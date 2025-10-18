import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src', // Alias raíz para src
      '@components': '/components', // Alias para components
      '@pages': '/pages', // Alias para pages
    },
  },
});