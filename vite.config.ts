import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  preview: {
    allowedHosts: ['painel-painel.jgbsku.easypanel.host'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ADIÇÃO PARA CORRIGIR O ERRO DO 'react-is' NO NAVEGADOR
      'react-is': path.resolve(__dirname, 'node_modules/react-is'),
    },
  },
  // A SEÇÃO 'build' FOI REMOVIDA, POIS O 'alias' ACIMA É A SOLUÇÃO CORRETA
});
