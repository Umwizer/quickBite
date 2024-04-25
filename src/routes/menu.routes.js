import express from 'express';
const MenuItem = express.Router();
import { addMenu,getMenuById,getMenuItems,updateMenuItem,deleteMenuItem } from '../controllers/menu.controllers.js';
import { menuValidation } from '../utils/validation.js';

MenuItem.post('/add', menuValidation, addMenu);
MenuItem.get('/retrieve', getMenuItems)
MenuItem.get('/retrieve/:id', getMenuById); 
MenuItem.put('/update/:id', menuValidation, updateMenuItem); 
MenuItem.delete('/delete/:id', deleteMenuItem);
export default MenuItem;