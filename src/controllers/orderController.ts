import { MenuItem, Restaurant } from "../models/restaurant";
import { Request, Response } from "express";
import { env } from "../lib/env";
import { Order } from "../models/order";
import Stripe from "stripe";

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    quantity: string;
    name: string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const STRIPE = new Stripe(env.STRIPE_API_KEY);
const FRONTEND_URL = env.FRONTEND_URL;

type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItem[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === cartItem.menuItemId
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: LineItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: menuItem.name,
        },
        unit_amount: menuItem.price,
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "usd",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}`,
  });

  return sessionData;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  const checkoutSessionRequest = req.body as CheckoutSessionRequest;

  const restaurant = await Restaurant.findById(
    checkoutSessionRequest.restaurantId
  );

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  const newOrder = new Order({
    restaurant: restaurant._id,
    user: req.userId,
    status: "placed",
    deliveryDetails: checkoutSessionRequest.deliveryDetails,
    cartItems: checkoutSessionRequest.cartItems,
  });

  const lineItems = createLineItems(
    checkoutSessionRequest,
    restaurant.menuItems
  );

  const session = await createSession(
    lineItems,
    newOrder._id.toString(),
    restaurant.deliveryPrice,
    restaurant._id.toString()
  );

  if (!session.url) {
    return res.status(500).json({ message: "Internal server error" });
  }

  await newOrder.save();

  res.status(200).json({ url: session.url });

  try {
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.log(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event?.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

export const orderController = {
  createCheckoutSession,
  stripeWebhookHandler,
};
