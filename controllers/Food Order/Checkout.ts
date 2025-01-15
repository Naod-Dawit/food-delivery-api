import express, { Express, Request, Response } from "express";
import stripe from "stripe";
const activestripe = new stripe(
  "sk_test_51PpRlJDhY4vz0hkIRHwDdwaXZgYEH0LMOAKi6HhfAoqNiXmY4Lky1ydeCaJMVYdq3u9EKcyG1Jf5P4DAhYSK6FV900qIMm4Mcc"
);

export const CreatePaymentIntent = async (req: Request, res: Response) => {
  const { items, price } = req.body;
  try {
    const customer = await activestripe.customers.create();
    const paymentIntent = await activestripe.paymentIntents.create({
      amount: price * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log(req.body);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
  }
};

export const webhook = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const signingSecret = "whsec_JZSzoE0ItMya7NMIZQEjSe1l5N6Sxnw1";

  if (!sig) {
    res.status(400).send("Missing Stripe signature header");
    return;
  }

  console.log("Raw Body:", req.body);

  let event;

  try {
    event = activestripe.webhooks.constructEvent(req.body, sig, signingSecret);
    console.log("Webhook event:", event);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("webhook received");
  
  res.status(200).send("Webhook received");
};
