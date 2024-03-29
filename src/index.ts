import { myRestaurantRoute } from "./routes/myRestaurantRoute";
import { orderRouter } from "./routes/orderRoute";
import { restaurantRouter } from "./routes/restaurantRoute";
import { myUserRoute } from "./routes/myUserRoute";
import { v2 as cloudinary } from "cloudinary";
import { env } from "./lib/env";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

mongoose
  .connect(env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/order", orderRouter);

app.listen(7000, () => console.log("Server running on port 7000"));
