import {Router} from "express";
import { authController } from "../controllers/authController.js";
//middleware zod
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { signUpSchema, signInSchema } from "../config/zod.js";
import { validateRefreshToken } from "../middlewares/validateRefreshToken.js";

const router = Router()
router.post("/signup", schemaValidator(signUpSchema),authController.signUp )
router.post("/signin", schemaValidator(signInSchema),authController.signIn )
router.get("/logout", authController.logout)
router.get("/refresh", validateRefreshToken, authController.refreshToken)
export {router as authRouter};