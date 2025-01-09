import express from 'express';
import { getRestaurants, addRestaurant, addMenu, getRestaurantById } from '../controllers/RestaurantController';
import { uploadData } from '../controllers/uploaddata';

const router = express.Router();

// Routes
router.get('/restaurants', getRestaurants);
router.post('/restaurants', addRestaurant);
router.post('/menus', addMenu);
router.post("/upload", uploadData);
router.get('/restaurants/:_id', getRestaurantById);


export default router;
