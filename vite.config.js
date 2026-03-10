import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    /* SPA fallback — /admin 등 클라이언트 라우트가 dev 서버에서 동작하도록 */
    historyApiFallback: true,
  },
})
