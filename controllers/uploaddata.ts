import { Restaurant } from "../models/RestaurantSchema";
import { Menu } from "../models/MenuSchema";
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
      });

      const savedRestaurant = await newRestaurant.save();

      // Find corresponding menus
      const restaurantMenus = menuData.find(
        (menuSet) => menuSet[0]?.name === restaurant.name
      );

      if (restaurantMenus && Array.isArray(restaurantMenus)) {
        for (const menu of restaurantMenus) {
          // Check if menu is valid
          if (menu && typeof menu === "object") {
            const newMenu:any = new Menu({
              restaurantId: savedRestaurant._id,
              type: menu.type,
              items: menu.items,
            });

            // Save the menu
            const savedMenu:any = await newMenu.save();
            newRestaurant.menus.push(newMenu)

            // Link menu to the restaurant
            if (savedMenu) {
              savedRestaurant.menus.push(savedMenu._id);
            }
          }
        }

        // Save the updated restaurant
        await savedRestaurant.save();
      }
    }

    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};
