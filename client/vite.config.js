import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Example of manual chunking to split large libraries
          vendor: ['react', 'react-dom', 'axios'], // Add other large dependencies here
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust chunk size warning limit to 1000 KB (default is 500 KB)
  },
  server: {
    proxy: {
      '/api/': {
        target: 'https://z-media-api.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
