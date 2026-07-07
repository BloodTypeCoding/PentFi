import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "serve-backend",
      configureServer(server) {
        server.middlewares.use("/Backend", (req, res, next) => {
          const filePath = path.join(
            __dirname,
            "..",
            "Backend",
            req.url,
          );
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const mime =
              ext === ".json"
                ? "application/json"
                : "application/octet-stream";
            res.setHeader("Content-Type", mime);
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
