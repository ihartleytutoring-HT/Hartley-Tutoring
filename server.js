import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    app: "Hartley Tutoring",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/payfast-notify", (req, res) => {
  console.log("Received payment gateway notification:", req.body);
  res.status(200).send("OK");
});
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Hartley Tutoring full-stack server running on port ${PORT}`);
});
