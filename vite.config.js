import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite"; 
import react from '@vitejs/plugin-react'; 
export default defineConfig({
  plugins: [tailwindcss(),react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false   // <-- This prevents Vite from cleaning outDir before building to avoid loading module issue in production
  },
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: "http://localhost:4000", // Your Express server port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
