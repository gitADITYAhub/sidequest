import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Required for Capacitor
  server: {
    host: true, // Allow access from local network
  },
})
