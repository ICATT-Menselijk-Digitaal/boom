import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/objects-api': {
        target: 'http://localhost:8000/api/v2/',
        changeOrigin: true,
        headers: {
          Authorization: `Token ${loadEnv('env', process.cwd()).VITE_OBJECTS_API_KEY}`,
          Cookie: '',
        },
        rewrite: (path) => path.replace(/^\/objects-api/, ''),
      },
      '/objecttypes-api': {
        target: 'http://localhost:8001/api/v2/',
        changeOrigin: true,
        headers: {
          Authorization: `Token ${loadEnv('env', process.cwd()).VITE_OBJECTTYPES_API_KEY}`,
          Cookie: '',
        },
        rewrite: (path) => path.replace(/^\/objecttypes-api/, ''),
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
