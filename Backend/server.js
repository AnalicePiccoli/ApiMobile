import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";
import dns from "node:dns";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";
import serviceRoutes from "./src/routes/service.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import { seedServices } from "./src/config/seedServices.js";
import swaggerSpec from "./src/docs/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: false });

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await seedServices();
    app.listen(PORT, () => console.log(`Servidor rodando na porta http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB erro de conexao:", err));
