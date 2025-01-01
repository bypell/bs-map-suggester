import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://scoresaber.balibalo.xyz/scoresaber-api/',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  plugins: [react(),],
  base: '/bs-map-suggester/',
})
