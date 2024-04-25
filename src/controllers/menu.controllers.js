import { NotFoundError,BadRequestError } from "../errors/index.js";
import asyncWrapper from "../middleware/sync.js";
import MenuItem from "../models/menu.models.js";
import { validationResult } from "express-validator";

export const addMenu = asyncWrapper(async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new BadRequestError(errors.array()[0].msg);
    }
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({
        status: "Menu has been added successfully",
        data: {
            menuItem
        }
    })
})
export const getMenuItems = async (req, res,next) =>{
    const menuItems = await MenuItem.find();
    res.status(200).json({
        status: "All Menu Items",
       menuItems:menuItems
    })
}
export const getMenuById = async(req, res, next) =>{
    const menuItem = await MenuItem.findById(req.params.id);
    if(!menuItem){
        throw new NotFoundError("Menu Item not found");
    }
    res.status(200).json({
        status: "Menu Item found",
        data: {
            menuItem
        }
    })
}
export const updateMenuItem = async (req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new BadRequestError(errors.array()[0].msg);
    }
    const menuItem = await MenuItem.findById(req.params.id);
    if(!menuItem){
        throw new NotFoundError("Menu Item not found");
    }
    menuItem.name = req.body.name;
    menuItem.description = req.body.description;
    menuItem.price = req.body.price;
    await menuItem.save();
    res.status(200).json({
        status: "Menu Item updated successfully",
        data: {
            menuItem
        }
    })
}
export const deleteMenuItem =async(req,res,next) =>{
    const menuItem = await MenuItem.findById(req.params.id);
    if(!menuItem){
        throw new NotFoundError("Menu Item not found");
    }
    await menuItem.deleteOne();
    res.status(204).json({
        status: "Menu Item deleted successfully"
    })
}