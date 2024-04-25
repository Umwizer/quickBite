import restaurantRouter from "./restaurant.routes.js";
import userRouter from "./user.routes.js";
import MenuItem from "./menu.routes.js";
import orderRouter from "./order.routes.js";
import express from "express";
const router = express.Router()
router.use('/users', userRouter);
router.use('/res',restaurantRouter)
router.use('/menu',MenuItem)
router.use('/order',orderRouter)
export default router;