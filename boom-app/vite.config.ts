import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/objects': {
        target: `http://localhost:${loadEnv('env', process.cwd()).BFF_PORT}`,
        changeOrigin: true,
      },
      '/objecttypes': {
        target: `http://localhost:${loadEnv('env', process.cwd()).BFF_PORT}`,
        changeOrigin: true,
      },
    },
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
