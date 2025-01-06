import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: false },
  rating: { type: Number, default: 0 },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  createdAt: { type: Date, default: Date.now },
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
