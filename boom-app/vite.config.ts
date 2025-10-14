import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/objects': {
        target: 'http://localhost:5007',
        changeOrigin: true,
        headers: {
          Authorization: `Token ${loadEnv('env', process.cwd()).VITE_OBJECTS_API_KEY}`,
          Cookie: '',
        },
      },
      '/objecttypes': {
        target: 'http://localhost:5007',
        changeOrigin: true,
        headers: {
          Authorization: `Token ${loadEnv('env', process.cwd()).VITE_OBJECTTYPES_API_KEY}`,
          Cookie: '',
        }
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
