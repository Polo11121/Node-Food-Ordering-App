import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";
import { uploadImage } from "../lib/helpers";
import { Order } from "../models/order";
import mongoose from "mongoose";

const createRestaurant = async (req: Request, res: Response) => {
  const existingRestaurant = await Restaurant.find({
    user: req.userId,
  });

  if (existingRestaurant.length) {
    return res.status(400).json({ message: "User restaurant already exists" });
  }

  const newRestaurant = new Restaurant({
    ...req.body,
    user: new mongoose.Types.ObjectId(req.userId),
  });

  const imageUrl = await uploadImage(req.file);

  if (imageUrl) {
    newRestaurant.imageUrl = imageUrl;
  }

  await newRestaurant.save();

  res.status(201).json(newRestaurant.toObject());

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.name = req.body.name;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.menuItems = req.body.menuItems;
    restaurant.cuisines = req.body.cuisines;
    restaurant.lastUpdated = new Date();

    const imageUrl = await uploadImage(req.file);

    if (imageUrl) {
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    res.status(200).json(restaurant.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(200).json(null);
    }

    res.status(200).json(restaurant.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting restaurant" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("user")
      .populate("restaurant");

    res.status(200).json(orders);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Error getting restaurant orders" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = status;

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

export const myRestaurantController = {
  createRestaurant,
  updateRestaurant,
  getRestaurant,
  getOrders,
  updateOrderStatus,
};
