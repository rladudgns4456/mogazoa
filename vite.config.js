import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr"; // svgr 임포트

export default defineConfig({
  plugins: [
    react(),
    svgr(), // 플러그인 추가
  ],
});
