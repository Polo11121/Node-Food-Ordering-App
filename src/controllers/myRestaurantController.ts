import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const createRestaurant = async (req: Request, res: Response) => {
  const existingRestaurant = await Restaurant.find({
    user: req.userId,
  });

  console.log();
  if (existingRestaurant.length) {
    return res.status(400).json({ message: "User restaurant already exists" });
  }

  const image = req.file as Express.Multer.File;
  const base64Image = image.buffer.toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.uploader.upload(dataURI);

  const newRestaurant = new Restaurant({
    ...req.body,
    user: new mongoose.Types.ObjectId(req.userId),
    imageUrl: uploadResponse.url,
  });

  await newRestaurant.save();

  res.status(201).json(newRestaurant.toObject());

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting restaurant" });
  }
};

export const myRestaurantController = { createRestaurant, getRestaurant };
