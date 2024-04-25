import { NotFoundError,BadRequestError } from "../errors/index.js";
import restaurantModel from "../models/restaurant.models.js";
import { validationResult } from "express-validator";

export const addRestaurant = async(req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    try {
        const restaurant = await restaurantModel.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                restaurant
            }
        });
    } catch (err) {
        next(err);
    }
}
export const getAllRestaurants = async(req,res,next) =>{
    const restaurants = await restaurantModel.find();
    res.status(200).json({
        message:'All restaurants',
        restaurants: restaurants
})}
export const getById = async(req, res, next) =>
{
    try {
        const restaurant = await restaurantModel.findById(req.params.id);
        if (!restaurant) {
            return next(new NotFoundError(`No restaurant with id ${req.params.id}`));
        }
        res.status(200).json({
            status: "success",
            data: {
                restaurant
            }
        });
    } catch (err) {
        next(err);
    }
}
export const updateRestaurant = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    try {
        const restaurant = await restaurantModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!restaurant) {
            return next(new NotFoundError(`No restaurant with id ${req.params.id}`));
        }
        res.status(200).json({
            status: "success",
            data: {
                restaurant
            }
        });
    } catch (err) {
        next(err);
    }
}
export const deleteRestaurant = async (req,res,next)=>{
const errors =validationResult(req)
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    try {
        const restaurantId = req.params.id;
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        await restaurantModel.findByIdAndDelete(restaurantId);
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        
        next(error);

}}