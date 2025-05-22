import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactScan from '@pivanov/vite-plugin-react-scan';

const ReactCompilerConfig = {
  target: '19' // '17' | '18' | '19'
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  console.log('Vite mode:', mode);
  return {
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
      reactScan(),
    ],
    base: '/bs-map-suggester/',
  };
});
