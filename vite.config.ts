import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // SEÇÃO ADICIONADA PARA PERMITIR O ACESSO
  preview: {
    allowedHosts: ['painel-painel.jgbsku.easypanel.host'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'react-is',
      ],
    },
  },
});
