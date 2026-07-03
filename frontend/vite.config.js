import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que o Docker exponha a porta corretamente
    port: 3000,
    // Em dev, encaminha os sites publicados pelo painel para o backend local
    // (mesmo papel do nginx em produção). Ajuste a porta se o backend dev
    // não estiver em 3001.
    proxy: {
      '/sites': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false // Oculta o código-fonte original na versão de produção
  }
})