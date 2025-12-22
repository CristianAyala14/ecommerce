import { Router } from "express";
import { ordersController } from "../controllers/ordersController.js";

const router = Router();

router.post("/", ordersController.add);
router.get("/current", ordersController.getCurrentOrder);
router.delete("/item/:productId", ordersController.removeItem);
router.delete("/clear", ordersController.clearOrder);
router.put("/quantity", ordersController.updateQuantity);

export { router as ordersRouter };