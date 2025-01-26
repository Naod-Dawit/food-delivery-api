import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: {
    name: { type: String, required: true },
  }, // Restaurant associated with the order
  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  address: {
    street: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    contact: { type: Number, required: true },
    instructions: { type: String,required:false },
  },
  dishes: [
    {
      dish: {
        name: { type: String, ref: "Menu", required: true },

        quantity: { type: Number, required: true },
        selectedOptions: { type: Array, required: false },
      }, // Ordered dish
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);
