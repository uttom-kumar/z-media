import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/' : {
        // target: 'https://zmedia.vercel.app', //vercel
        target: 'https://z-media.onrender.com', //render
        // target: 'http://localhost:5050', //local
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Default 500 KB, manual 1000 KB
  }
})
