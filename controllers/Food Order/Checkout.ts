import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import stripe from "stripe";
import { Order } from "../../models/OrderSchema";
import { Restaurant } from "../../models/RestaurantSchema";
const secret_key: any = process.env.SECRET_KEY;

const activestripe = new stripe(secret_key);

export const CreateCheckoutSession = async (req: Request, res: Response) => {
  const { items, price, address, contact } = req.body;
  try {
    const session = await activestripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:5000/api/success",
      cancel_url: "http://localhost:5000/api/success",
      metadata: { address: JSON.stringify(address), contact },
    });


    const itemQuantity = items.map(
      (item: { quantity: number }) => item.quantity
    );

    const itemNames = items.map((item: { name: any }) => item.name);
    const itemSelectedOptions = items.map(
      (item: { selectedOptions: any }) => item.selectedOptions
    );


    const restaurant = await Restaurant.findOne(
      {
        menus: {
          $elemMatch: {
            $elemMatch: {
              "items.name": { $in: itemNames },
            },
          },
        },
      },
      {
        name: 1, // Include the 'name' field
        _id: 0, // Exclude the '_id' field
      }
    );

   

    const dishes = items.map(
      (
        item: { name: any; quantity: any; selectedOptions: any },
        index: any
      ) => ({
        dish: {
          name: item.name, // Single item name
          quantity: item.quantity, // Single quantity
          selectedOptions: item.selectedOptions, // Options for each item
        },
      })
    );

    const createorder = new Order({
      restaurant: restaurant, // Assuming this is a valid object with 'name' included
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        contact: address.contact,
        instructions: address.instructions,
      },
      contact: contact,
      dishes: dishes, // Add the properly formatted dishes
      totalPrice: price,
    });

    await createorder.save();

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
  }
};

export const webhook = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const signingSecret: any = process.env.SIGNING_SECRET;
  const Secretkey: any = process.env.SECRET_KEY;


console.log("signing key",signingSecret) 
console.log("secret key",secret_key) 

 if (!sig) {
    res.status(400).send("Missing Stripe signature header");
    return;
  }
  if (!signingSecret) {
    throw new Error("Stripe secret key is missing in environment variables.");
  }

  let event;

  try {
    event = activestripe.webhooks.constructEvent(req.body, sig, signingSecret);
    console.log(event.data);
    
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      fulfillCheckout(event.data.object.id);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  res.status(200).send("Webhook received");
};
function fulfillCheckout(id: string) {
  throw new Error("Function not implemented.");
}
