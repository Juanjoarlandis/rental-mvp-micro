import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https: true,  // MODIFIED: HTTPS en dev (usa cert auto-firmado de Vite)
    proxy: {
      "/api/auth":       "https://localhost:8001",  // MODIFIED: Cambiado a HTTPS
      "/api/items":      "https://localhost:8002",
      "/api/categories": "https://localhost:8002",
      "/api/rentals":    "https://localhost:8003",
      "/api/upload":     "https://localhost:8004",
      "/api/payments":   "https://localhost:8005",
      "/uploads":        "https://localhost:8004"
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true  // This forces proper transformation of mixed ESM/CJS modules like clsx
    }
  }
});