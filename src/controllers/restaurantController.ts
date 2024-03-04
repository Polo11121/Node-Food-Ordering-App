import { Restaurant } from "../models/restaurant";
import { Request, Response } from "express";
import { Types } from "mongoose";

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query.city = new RegExp(city, "i");

    const cityCheck = await Restaurant.countDocuments(query);

    if (!cityCheck) {
      return res.status(200).json({
        data: [],
        pagination: {
          total: 0,
          page,
          pageSize: 10,
          totalPages: 0,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query.cuisines = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");

      query["$or"] = [
        {
          name: searchRegex,
        },
        {
          cuisines: { $in: [searchRegex] },
        },
      ];
    }

    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .limit(pageSize)
      .skip(skip)
      .limit(pageSize);

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid restaurant id" });
    }
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const restaurantController = {
  searchRestaurants,
  getRestaurantById,
};
