import express from 'express';
import { getRestaurants, addRestaurant, addMenu, getRestaurantById } from '../controllers/RestaurantController';
import { uploadData } from '../controllers/uploaddata';
import { CreatePaymentIntent, webhook } from '../controllers/Food Order/Checkout';

const router = express.Router();

// Routes
router.get('/restaurants', getRestaurants);
router.post('/restaurants', addRestaurant);
router.post('/menus', addMenu);
router.post("/upload", uploadData);
router.get('/restaurants/:_id', getRestaurantById);
router.post("/create-payment-intent", CreatePaymentIntent); 
router.post("/webhook", express.raw({ type: "application/json" }), webhook);


export default router;
