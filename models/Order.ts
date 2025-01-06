import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Customer placing the order
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Restaurant associated with the order
  dishes: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true }, // Ordered dish
      quantity: { type: Number, required: true }, // Quantity of the dish
    },
  ],
  totalPrice: { type: Number, required: true }, // Total price of the order
  status: { type: String, default: 'Pending' }, // Order status (e.g., Pending, Preparing, Delivered)
  createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp
});

module.exports = mongoose.model('Order', orderSchema);
