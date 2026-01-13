import {Router} from "express";
import { userController } from "../controllers/userController.js";
import { validateAccessToken } from "../middlewares/validateAccessToken.js";
import upload from "../config/multer.js";

const router = Router()
router.get("/:id", validateAccessToken, userController.getUserById)
router.put("/update", validateAccessToken, upload.single("file"),  userController.updateUser)
router.delete("/delete", validateAccessToken, userController.deleteUser)

export {router as userRouter};