import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";

import bodyParser from "body-parser";

import postRoutes from "./routes/post.Routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(postRoutes);
app.use(userRoutes);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  const connectDb = await mongoose.connect(
    "mongodb+srv://abhishek9410dwivedi:social-connect@cluster0.gcpzigz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
};
start();
