import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/auth":       "http://localhost:8001",
      "/api/items":      "http://localhost:8002",
      "/api/categories": "http://localhost:8002",
      "/api/rentals":    "http://localhost:8003",
      "/api/upload":     "http://localhost:8004",
      "/api/payments":   "http://localhost:8005",
      "/uploads":        "http://localhost:8004"
    }
  }
});
