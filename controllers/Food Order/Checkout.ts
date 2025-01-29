import dotenv from "dotenv";
dotenv.config();


import express, { Express, Request, Response } from "express";
import stripe from "stripe";
import { Order } from "../../models/OrderSchema";
import { Restaurant } from "../../models/RestaurantSchema";
const secret_key:any= process.env.SECRET_KEY

const activestripe = new stripe(
  secret_key
);

export const CreatePaymentIntent = async (req: Request, res: Response) => {
  const { items, price, address, contact } = req.body;
  try {
    const customer = await activestripe.customers.create();
    const paymentIntent = await activestripe.paymentIntents.create({
      amount: price * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log(items);

    const itemNames = items.map((item: { name: any }) => item.name);
    const itemQuantity = items.map(
      (item: { quantity: number }) => item.quantity
    );

    const itemSelectedOptions = items.map(
      (item: { selectedOptions: any }) => item.selectedOptions
    );

    console.log("itemnames", itemNames);

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

    console.log("restaurant", restaurant?.name);
    console.log("items", itemNames);
    console.log("quantity", itemQuantity);

    console.log("adress", address);
    console.log("contact", contact);
    console.log("selected", itemSelectedOptions);

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
        instructions:address.instructions
      },
      contact: contact,
      dishes: dishes, // Add the properly formatted dishes
      totalPrice: price,
    });

    await createorder.save();

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
  }
};

export const webhook = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const signingSecret = "whsec_jYOHG8p78xEFPkN0WslSprd3mUiQtRIb";

  if (!sig) {
    res.status(400).send("Missing Stripe signature header");
    return;
  }

  let event;

  try {
    event = activestripe.webhooks.constructEvent(req.body, sig, signingSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  res.status(200).send("Webhook received");
};
