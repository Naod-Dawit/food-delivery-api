import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  type: String,
  items: [
    {
      name: String,
      image:String,
      description: String,
      price: Number,
      options: [
        {
          additive: String,
          price: Number,
        },
      ],
    },
  ],
});

export const Menu = mongoose.model("Menu", MenuSchema);
