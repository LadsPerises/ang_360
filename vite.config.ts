import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://angola360.ao',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost', // Reescreve o domínio do cookie para funcionar no localhost
      }
    }
  }
})
