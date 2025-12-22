import { productsService } from "./services/productsService.js";
import { categoriesService } from "./services/categoriesService.js";
import { ordersService } from "./services/ordersService.js";
import { userService } from "./services/userService.js";

export const productsDao = new productsService();
export const categoriesDao= new categoriesService();
export const ordersDao = new ordersService();
export const userDao = new userService();