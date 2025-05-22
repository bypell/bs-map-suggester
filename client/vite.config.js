import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = {
  target: '19' // '17' | '18' | '19'
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api': 'https://scoresaber.com',
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
  base: '/bs-map-suggester/',
})
