import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/calendars': 'http://127.0.0.1:8080', // Adjust the backend URL and port
      '/events': 'http://127.0.0.1:8080', // Proxy for events API
    },
  },
});
