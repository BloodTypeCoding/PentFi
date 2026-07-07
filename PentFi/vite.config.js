import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKEND_ROOT = path.join(__dirname, "..", "Backend");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "serve-backend",
      configureServer(server) {
        server.middlewares.use("/Backend", (req, res, next) => {
          const filePath = path.join(BACKEND_ROOT, req.url);

          if (path.extname(filePath) === ".json") {
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => (body += chunk));
              req.on("end", () => {
                const nuevoRegistro = JSON.parse(body);
                const existentes = fs.existsSync(filePath)
                  ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
                  : [];
                existentes.push(nuevoRegistro);
                fs.writeFileSync(filePath, JSON.stringify(existentes, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              });
              return;
            }
            if (req.method === "PUT") {
              let body = "";
              req.on("data", (chunk) => (body += chunk));
              req.on("end", () => {
                fs.writeFileSync(filePath, JSON.stringify(JSON.parse(body), null, 2));
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              });
              return;
            }
          }

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
