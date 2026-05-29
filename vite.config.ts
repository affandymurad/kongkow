import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Saat `npm run dev:local` (Vite + Express terpisah),
      // request /api/* diteruskan ke Express backend di port 3001.
      // Saat `netlify dev`, proxy ini tidak dipakai (Netlify yang handle redirect).
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
