import { Router } from "express";
import { categoriesController } from "../controllers/categoriesController.js";
import { validateAccessToken } from "../middlewares/validateAccessToken.js";
import upload from "../config/multer.js";

const router = Router();

// CRUD completo de categorías
router.post("/create", validateAccessToken, upload.single("file"),  categoriesController.createCategory);
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);
router.put("/:id", validateAccessToken, upload.single("file"),  categoriesController.updateCategory);
router.delete("/:id", validateAccessToken, categoriesController.deleteCategory);

export { router as categoriesRouter };
 