import express from 'express';
const orderRouter= express.Router();
import { fetchOrders,updateOrderStatus,createOrder } from '../controllers/order.controllers.js';
import {orderValidation } from '../utils/validation.js';

orderRouter.post('/add', orderValidation, createOrder);
orderRouter.get('/retrieve', fetchOrders)
// orderRouter.get('/retrieve/:id', getOrderById); 
orderRouter.put('/update/:id', orderValidation, updateOrderStatus); 
// orderRouter.delete('/delete/:id', deleteOrder);
export default orderRouter;