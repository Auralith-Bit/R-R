import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // While developing locally (`npm run dev`), forward API calls to
    // the backend on port 4000 so the frontend can just fetch relative
    // paths like "/api/catalog" — no VITE_API_URL needed, and it
    // matches exactly how things work once deployed together in
    // production (same domain, no CORS).
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
})
