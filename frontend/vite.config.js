import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que o Docker exponha a porta corretamente
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false // Oculta o código-fonte original na versão de produção
  }
})