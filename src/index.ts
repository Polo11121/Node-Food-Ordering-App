import { myUserRoute } from "./routes/myUserRoute";
import { env } from "./lib/env";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { myRestaurantRoute } from "./routes/myRestaurantRoute";

mongoose
  .connect(env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"));

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);

app.listen(7000, () => console.log("Server running on port 7000"));
