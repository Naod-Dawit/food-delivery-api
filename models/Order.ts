import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Customer placing the order
  restaurant: {
    name: { type: String, required: true },
    
    ref: "Restaurant",
    required: true,
  }, // Restaurant associated with the order
  dishes: [
    {
      dish: {
        name:{type:String,required:true},
        ref: "Menu",
        required: true,
      }, // Ordered dish
      quantity: { type: Number, required: true },     },
  ],
  totalPrice: { type: Number, required: true }, 
  status: { type: String, default: "Pending" }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Order", orderSchema);
