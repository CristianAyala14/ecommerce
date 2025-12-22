import { Router } from "express";
import { categoriesController } from "../controllers/categoriesController.js";
const router = Router();

// CRUD completo de categorías
router.post("/", categoriesController.createCategory);
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);
router.put("/:id", categoriesController.updateCategory);
router.delete("/:id", categoriesController.deleteCategory);

export { router as categoriesRouter };
