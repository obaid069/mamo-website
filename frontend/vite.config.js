import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "Module level directive" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    },
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Use esbuild instead of terser
    sourcemap: false
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  }
})
