import { Router } from "express";
import { ordersController } from "../controllers/ordersController.js";

const router = Router();

router.post("/", ordersController.add);
router.get("/current", ordersController.getCurrentOrder);
router.delete("/item/:productId", ordersController.removeItem);
router.put("/quantity", ordersController.updateQuantity);
router.post("/pay", ordersController.payOrder);

export { router as ordersRouter };