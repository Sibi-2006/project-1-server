import express from "express";
import cors from "cors";
import { getDataBase } from "./db.js";
import router from "./routers/formRouter.js";
import postRouter from "./routers/postRouter.js";

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// API routes
app.use("/api/form", router);
app.use("/api/post", postRouter);

// Start server after DB connection
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
