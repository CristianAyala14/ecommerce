import express from "express";
import { envObject } from "./config/enviroment.js";
import { ConnectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

//FRONTends conecctions
const allowedOrigins = [
  envObject.frontend.public, // frontend público
  envObject.frontend.panel_admin // panel admin
];

//routes imports
import { productsRouter } from "./routes/productsRouter.js"; 
import { categoriesRouter } from "./routes/categoriesRouter.js";
import { ordersRouter } from "./routes/ordersRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { imgRouter } from "./routes/imgRouter.js";

//app set
const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors({
    origin: allowedOrigins, 
    credentials: true}))
app.use(cookieParser())
app.use(morgan("dev"))


//DB connect
ConnectDB();


//app routes}
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/products", productsRouter)
app.use("/api/categories", categoriesRouter); 
app.use("/api/orders", ordersRouter);
app.use("/api/upload-img", imgRouter)

//server run
const PORT = envObject.server.port
app.listen(PORT, ()=>{
    console.log(`El servidor funciona en el puerto: ${PORT}`)
}) 