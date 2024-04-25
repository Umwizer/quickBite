import { NotFoundError,BadRequestError } from "../errors/index.js";
import asyncWrapper from "../middleware/sync.js";
import Order from "../models/order.models.js";
import { validationResult } from "express-validator";

export const addOrder = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new BadRequestError(errors.array()[0].msg);
    }
    try{
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    }catch(error){
        next(error);
    }
}
export const getOrder = (req, res) =>{
    Order.find().then((orders)=>{
        res.status(200).send(orders);
    }).catch((error)=>{
        next(error);
    });
}
export const getOrderById = (req, res,next) =>{
    const id = req.params.id;
    Order.findById(id).then((order)=>{
        if(!order){
            throw new NotFoundError("Order not found");
        }
        res.status(200).send(order);
    }).catch((e)=>{
        next(e);
    });
}
export const updateOrder = (req,res,next) =>{
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status"];
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update);
    });
    if(!isValidOperation){
        throw new BadRequestError("Invalid updates");
    }
    Order.findByIdAndUpdate(id,req.body,{new:true,runValidators:true}).then((order)=>{
        if(!order){
            throw new NotFoundError("Order not found");
        }
        res.status(200).send(order);
    }).catch((e)=>{
        next(e);
    });
}
export const deleteOrder = (req, res,next) => {
    const id = req.params.id;
    Order.findByIdAndDelete(id).then((order)=>{
        if(!order){
            throw new NotFoundError("Order not found");
        }
        res.status(200).send(order);
    }).catch((e)=>{
        next(e);
    });
}