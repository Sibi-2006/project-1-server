import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getDataBase } from "./db.js";
import router from "./routers/formRouter.js";
import postRouter from "./routers/postRouter.js";

const app = express();
const PORT = process.env.PORT || 3500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// API routes
app.use("/api/form", router);
app.use("/api/post", postRouter);

// Serve React frontend (adjust path if needed)
app.use(express.static(path.join(__dirname, "../../build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../project-1/build", "index.html"));
});

const startServer = async () => {
  try {
    await getDataBase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}....`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
  }
};

startServer();
