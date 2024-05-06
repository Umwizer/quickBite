import restaurantRouter from "./restaurant.routes.js";
import userRouter from "./user.routes.js";
import MenuItem from "./menu.routes.js";
import orderRouter from "./order.routes.js";
import Cartrouter from "./cart.routes.js";
import express from "express";
import authRoutes from "./auth.routes.js";
const router = express.Router()
router.use('/users', userRouter);
router.use('/restaurant',restaurantRouter)
router.use('/menu',MenuItem)
router.use('/order',orderRouter)
router.use('/cart',Cartrouter)
router.use('/auth',authRoutes)
export default router;