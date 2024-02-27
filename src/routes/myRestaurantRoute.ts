import { getRestaurant } from "./../controllers/myRestaurantController";
import { myRestaurantController } from "../controllers/myRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const myRestaurantRoute = express.Router();

myRestaurantRoute
  .post(
    "/",
    upload.single("imageFile"),
    jwtCheck,
    jwtParse,
    validateMyRestaurantRequest,
    myRestaurantController.createRestaurant
  )
  .get("/", jwtCheck, jwtParse, myRestaurantController.getRestaurant);
