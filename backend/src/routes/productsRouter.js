// routes/productsRouter.js
import { Router } from "express";
import { productsController } from "../controllers/productsController.js";
import { validateAccessToken } from "../middlewares/validateAccessToken.js";

const router = Router();



//obtener ofertas
router.get("/new", productsController.getNewProducts);

//obtener nuevos
router.get("/offers", productsController.getProductsOnOffer);

// Obtener todos los productos (con filtros, paginación y sort)
router.get("/getall", productsController.getAllProducts);

// Obtener un producto por ID
router.get("/:id", productsController.getProductById);

// Crear un nuevo producto
router.post("/", validateAccessToken, productsController.createProduct);

// Actualizar un producto por ID
router.put("/:id", validateAccessToken, productsController.updateProduct);

// Eliminar un producto por ID
router.delete("/:id", validateAccessToken, productsController.deleteProduct);

export { router as productsRouter };