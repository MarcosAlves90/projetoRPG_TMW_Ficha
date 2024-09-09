// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'import.meta.env.VITE_APP_FIREBASE_API_KEY': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_API_KEY),
    'import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN),
    'import.meta.env.VITE_APP_FIREBASE_PROJECT_ID': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_PROJECT_ID),
    'import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET),
    'import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID),
    'import.meta.env.VITE_APP_FIREBASE_APP_ID': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_APP_ID),
    'import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID': JSON.stringify(import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID)
  }
});