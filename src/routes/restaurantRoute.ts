import { restaurantController } from "../controllers/restaurantController";
import { param } from "express-validator";
import express from "express";

export const restaurantRouter = express.Router();

restaurantRouter
  .get(
    "/search/:city",
    param("city")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("City parameter is required"),
    restaurantController.searchRestaurants
  )
  .get(
    "/:id",
    param("id")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Id parameter is required"),
    restaurantController.getRestaurantById
  );
