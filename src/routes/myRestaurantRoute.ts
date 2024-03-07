import { myRestaurantController } from "../controllers/myRestaurantController";
import { validateMyRestaurantRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";
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
  .put(
    "/",
    upload.single("imageFile"),
    jwtCheck,
    jwtParse,
    validateMyRestaurantRequest,
    myRestaurantController.updateRestaurant
  )
  .patch(
    "/order/:orderId/status",
    jwtCheck,
    jwtParse,
    myRestaurantController.updateOrderStatus
  )
  .get("/", jwtCheck, jwtParse, myRestaurantController.getRestaurant)
  .get("/order", jwtCheck, jwtParse, myRestaurantController.getOrders);
