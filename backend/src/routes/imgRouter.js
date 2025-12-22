// routes/imgRouter.js
import express from "express";
import upload from "../config/multer.js"; // importamos Multer
import { imgController } from "../controllers/imgController.js";
import { validateAccessToken } from "../middlewares/validateAccessToken.js";

const router = express.Router();

// "file" es el nombre del campo que envía el frontend
router.post("/", validateAccessToken, upload.single("file"), imgController.upload);

export { router as imgRouter };
