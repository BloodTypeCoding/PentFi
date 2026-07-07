import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.join(__dirname, "..", "Backend");
const DIST = path.join(__dirname, "dist");

const app = express();
app.use(express.json());

app.use("/Backend", (req, res) => {
  const filePath = path.join(BACKEND_ROOT, req.path);

  if (req.method === "GET") {
    if (!fs.existsSync(filePath)) return res.status(404).end();
    const ext = path.extname(filePath);
    const mime = ext === ".json" ? "application/json" : "application/octet-stream";
    res.setHeader("Content-Type", mime);
    return res.end(fs.readFileSync(filePath));
  }

  if (path.extname(filePath) !== ".json") return res.status(400).end();
  if (req.method !== "POST" && req.method !== "PUT") return res.status(405).end();

  try {
    const data = req.body;
    if (req.method === "POST") {
      const existentes = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
        : [];
      existentes.push(data);
      fs.writeFileSync(filePath, JSON.stringify(existentes, null, 2));
    } else {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
  }
});

app.use(express.static(DIST));

app.use((req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
