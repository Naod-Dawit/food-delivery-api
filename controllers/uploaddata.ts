import { Restaurant } from "../models/RestaurantSchema";
import restaurantData from "../restaurant.json";
import menuData from "../menu.json";

export const uploadData = async () => {
  try {
    for (const restaurant of restaurantData) {
      // Create and save the restaurant
      const newRestaurant = new Restaurant({
        name: restaurant.name, 
        address: restaurant.address,
        category: restaurant.category,
        rating: parseFloat(restaurant.rating),
        createdAt: new Date(),
        menus: []
      });

      // Find corresponding menus
      const restaurantMenus = menuData.find(
        (menuSet) => menuSet[0]?.name === restaurant.name
      );

      if (restaurantMenus && Array.isArray(restaurantMenus)) {
        for (const menu of restaurantMenus) {
          // Check if menu is valid
          if (menu && typeof menu === "object") {
            // Directly embed the menu into the restaurant document
            newRestaurant.menus.push({
              type: menu.type,
              items: menu.items,
            });
          }
        }
      }

      // Save the updated restaurant with embedded menus
      await newRestaurant.save();
    }

    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};
