import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works on GitHub Pages regardless of repo name.
export default defineConfig({
  plugins: [react()],
  base: "./"
});
