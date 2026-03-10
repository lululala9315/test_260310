import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* GitHub Pages 배포 시 저장소 이름이 base 경로가 됨 */
  base: process.env.NODE_ENV === 'production' ? '/test_260310/' : '/',
  server: {
    /* SPA fallback — /admin 등 클라이언트 라우트가 dev 서버에서 동작하도록 */
    historyApiFallback: true,
  },
})
