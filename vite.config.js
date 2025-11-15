// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tailwindcss from "@tailwindcss/vite";

dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  define: {
    "process.env.VITE_APP_FIREBASE_API_KEY": JSON.stringify(
      process.env.VITE_APP_FIREBASE_API_KEY,
    ),
    "process.env.VITE_APP_FIREBASE_AUTH_DOMAIN": JSON.stringify(
      process.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    ),
    "process.env.VITE_APP_FIREBASE_PROJECT_ID": JSON.stringify(
      process.env.VITE_APP_FIREBASE_PROJECT_ID,
    ),
    "process.env.VITE_APP_FIREBASE_STORAGE_BUCKET": JSON.stringify(
      process.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    ),
    "process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
      process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    ),
    "process.env.VITE_APP_FIREBASE_APP_ID": JSON.stringify(
      process.env.VITE_APP_FIREBASE_APP_ID,
    ),
    "process.env.VITE_APP_FIREBASE_MEASUREMENT_ID": JSON.stringify(
      process.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
    ),
  },
  resolve: {
    alias: {
      "@": "/src",
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
});
