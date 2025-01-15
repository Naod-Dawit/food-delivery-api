import { Request, Response } from "express";
import { Restaurant } from "../models/RestaurantSchema";
import { Menu } from "../models/MenuSchema";

import axios from "axios";
// Fetch restaurants with populated menus
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({});

    res.status(200).json(restaurants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// Add a restaurant
export const addRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, address, category, menus } = req.body;

    const restaurant = new Restaurant({
      name,
      address,
      category,
      menus, // Pass menu ObjectIds
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add a menu
export const addMenu = async (req: Request, res: Response) => {
  try {
    const { name, type, items } = req.body;

    const menu = new Menu({
      name,
      type,
      items,
    });

    await menu.save();
    res.status(201).json(menu);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.params; 
  

  try {
    if (_id) {
      const restaurant = await Restaurant.findById(_id);
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      return res.status(200).json(restaurant); // Return the restaurant directly
    }
    res.status(400).json({ error: "Restaurant ID is required" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
};
