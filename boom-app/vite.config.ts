import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const port = loadEnv('env', process.cwd()).VITE_BFF_PORT

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/objects': {
        target: `http://localhost:${port}`,
        changeOrigin: true,
      },
      '/objecttypes': {
        target: `http://localhost:${port}`,
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
