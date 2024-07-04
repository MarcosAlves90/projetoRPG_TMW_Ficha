// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/projetoRPG_TMW_Ficha/' // Ajuste para o caminho do seu projeto no GitHub Pages
});