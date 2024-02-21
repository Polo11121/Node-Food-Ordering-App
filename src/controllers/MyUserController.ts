import User from "../models/user";
import { Request, Response } from "express";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export default {
  createCurrentUser,
};
