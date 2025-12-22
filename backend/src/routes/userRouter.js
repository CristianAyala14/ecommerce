import {Router} from "express";
import { userController } from "../controllers/userController.js";
import { validateAccessToken } from "../middlewares/validateAccessToken.js";

const router = Router()
router.get("/:id", validateAccessToken, userController.getUserById)
router.put("/update", validateAccessToken, userController.updateUser)
router.delete("/delete", validateAccessToken, userController.deleteUser)

export {router as userRouter};