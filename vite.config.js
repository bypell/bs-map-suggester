import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://scoresaber.com',
    },
  },
  plugins: [react(),],
  base: '/bs-map-suggester/',
})
