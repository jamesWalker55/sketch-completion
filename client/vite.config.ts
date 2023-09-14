import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { parse } from "smol-toml";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": (() => {
        const configPath = path.resolve(__dirname, "../config.toml");
        const config = parse(fs.readFileSync(configPath, "utf8"));
        const apiHost = config["client"]["api_host"];
        if (typeof apiHost !== "string")
          throw `failed to get API host from config.client.api_host: ${apiHost}`;

        return apiHost;
      })(),
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
