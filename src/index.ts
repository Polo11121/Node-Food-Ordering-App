import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./routes/myUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"));

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);

app.listen(7000, () => console.log("Server running on port 7000"));
