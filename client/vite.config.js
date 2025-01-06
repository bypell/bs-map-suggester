import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api': 'https://scoresaber.com',
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/scoresaber')
      }
    },
  },
  plugins: [react(),],
  base: '/bs-map-suggester/',
})
