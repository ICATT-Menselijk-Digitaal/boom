import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, ProxyOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


const proxyCalls = [
  "/objecttypes",
  "/objects"
]

const getProxy = (env?: Record<string, string>,): Record<string, ProxyOptions> | undefined => {
  const targetPort = env?.BFF_PORT;
  if (!targetPort) return undefined

  const redirectOptions: ProxyOptions = {
    target: `http://localhost:${targetPort}`,
    secure: false
  };
  return Object.fromEntries(proxyCalls.map((key) => [key, redirectOptions]));
}

export default defineConfig(({ mode }) => {
  const env =
    mode === "development" ? loadEnv(mode, process.cwd(), "") : undefined;
  const proxy = env && getProxy(env);
  return {
    server: {
      proxy
    },
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
});
