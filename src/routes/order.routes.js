import express from 'express';
const orderRouter= express.Router();
import { addOrder,getOrder,getOrderById,updateOrder,deleteOrder } from '../controllers/order.controllers.js';
import {orderValidation } from '../utils/validation.js';

orderRouter.post('/add', orderValidation, addOrder);
orderRouter.get('/retrieve', getOrder)
orderRouter.get('/retrieve/:id', getOrderById); 
orderRouter.put('/update/:id', orderValidation, updateOrder); 
orderRouter.delete('/delete/:id', deleteOrder);
export default orderRouter;