import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  allowedHosts: ['frontend'],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    allowedHosts: ['frontend', 'localhost', '0.0.0.0'],
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
