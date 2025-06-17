import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnection from "./config/dbconnection.js";

import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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