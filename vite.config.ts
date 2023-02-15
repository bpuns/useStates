import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(function (env) {

  const isDev = env.command !== 'build'

  return {
    define: {
      isDev
    },
    resolve: {
      alias: {
        'src': path.join(__dirname, './src')
      }
    },
    plugins: [
      react()
    ]
  }
})