import express from 'express';
import { addItemToCart, updateCartItem, deleteCartItem, getCart, getCartItemById } from '../controllers/cart.controllers.js';

const CartRouter = express.Router();

CartRouter.post('/add', addItemToCart);
CartRouter.put('/update/:id', updateCartItem);
CartRouter.delete('/remove/:id', deleteCartItem);
CartRouter.get('/items', getCart);
CartRouter.get('/items/:id', getCartItemById);

export default CartRouter;
