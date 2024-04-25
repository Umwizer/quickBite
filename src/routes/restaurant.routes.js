import express from 'express';
const restaurantRouter = express.Router();
import {addRestaurant, getAllRestaurants,getById,updateRestaurant,deleteRestaurant } from '../controllers/restaurant.controllers.js';
import { addValidation } from '../utils/validation.js';

restaurantRouter.post('/add', addValidation, addRestaurant);
restaurantRouter.get('/list', getAllRestaurants)
restaurantRouter.get('/list/:id', getById); 
restaurantRouter.put('/update/:id', addValidation, updateRestaurant); 
restaurantRouter.delete('/delete/:id', deleteRestaurant);
export default restaurantRouter;