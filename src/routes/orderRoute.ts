import { jwtCheck, jwtParse } from "../middleware/auth";
import { orderController } from "../controllers/orderController";
import express from "express";

export const orderRouter = express.Router();

orderRouter
  .post(
    "/checkout/create-checkout-session",
    jwtCheck,
    jwtParse,
    orderController.createCheckoutSession
  )
  .post("/checkout/webhook", orderController.stripeWebhookHandler)
  .get("/", jwtCheck, jwtParse, orderController.getMyOrders);
