import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../',
  server: {
    host: '0.0.0.0',
    https: {
      "key": "127.0.0.1-key.pem",
      "cert": "127.0.0.1.pem"
    }
  },
})