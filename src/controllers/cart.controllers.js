import { NotFoundError, BadRequestError } from "../errors/index.js";
import asyncWrapper from "../middleware/sync.js";
import MenuItem from "../models/menu.models.js";
import { validationResult } from "express-validator";
import CartItem from "../models/cart.models.js";

export const addItemToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemName, price, quantity, totalPrice } = req.body;

    const newItem = new CartItem({
      itemName,
      price,
      quantity,
      totalPrice,
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart. Please try again later." });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, price, quantity, totalPrice } = req.body;

    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      { itemName, price, quantity, totalPrice },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to update item in cart. Please try again later.",
      });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await CartItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to delete item from cart. Please try again later.",
      });
  }
};

export const getCart = async (req, res) => {
    try {
   
      const cartItems = await CartItem.find();
  
      res.status(200).json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve cart items. Please try again later.' });
    }
  };
  

  export const getCartItemById = async (req, res) => {
    try {
      const { id } = req.params;
  
   
      const cartItem = await CartItem.findById(id);
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Item not found in cart.' });
      }
  
      res.status(200).json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve cart item. Please try again later.' });
    }
  };
  