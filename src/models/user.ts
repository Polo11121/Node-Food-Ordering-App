import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  city: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  country: {
    type: String,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
