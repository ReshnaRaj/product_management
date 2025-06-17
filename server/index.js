import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import dbconnection from "./config/dbconnection.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(
  "/productimages",
  express.static(path.join(__dirname, "public/productimages"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category",categoryRoutes)
app.use("/api/product",productRoutes)





dbconnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error.");
  });