// order.controllers.js

import { validationResult } from "express-validator";
import OrderModel from "../models/order.models.js";
import MenuItem from "../models/menu.models.js";
import userModel from "../models/users.models.js";
import { sendEmail } from "../utils/emailNotification.js"; // Importing sendEmail function

export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { customerId, selectedMenuItems, shippingAddress } = req.body;

    // Fetch menu items and their prices
    const menuItemIds = selectedMenuItems.map(item => item.itemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    // Calculate total amount and total items
    let totalAmount = 0;
    const itemsWithPrice = selectedMenuItems.map(selectedItem => {
      const menuItem = menuItems.find(item => item._id.toString() === selectedItem.itemId);
      const itemTotalPrice = menuItem.price * selectedItem.quantity;
      totalAmount += itemTotalPrice;
      return { ...selectedItem, name: menuItem.name, price: menuItem.price, totalItemPrice: itemTotalPrice };
    });
    const totalItems = itemsWithPrice.reduce((total, item) => total + item.quantity, 0);

    // Create the order
    const order = new OrderModel({
      customer: customerId,
      selectedMenuItems: itemsWithPrice,
      totalItems: totalItems,
      totalAmount: totalAmount,
      status: "pending",
      shippingAddress: shippingAddress,
    });

    await order.save();

    // Send email notification to the user
    const user = await userModel.findById(customerId);
    const recipientEmail = user.email;
    const subject = "Your order has been received";
    const body = `Dear ${user.firstname},\n\nYour order has been received successfully.\n\n`;
    const itemsInfo = itemsWithPrice.map(item => `Item: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}, Total Price: ${item.totalItemPrice}`).join('\n');
    const orderInfo = `${body}Order Items:\n${itemsInfo}\n\nTotal amount: ${totalAmount}\n\nThank you for your order!`;
    sendEmail(recipientEmail, subject, orderInfo); // Using sendEmail function from emailNotification.js

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order. Please try again later." });
  }
};

export const fetchOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate({
        path: "customer",
        select: "email firstname lastname" 
      });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders. Please try again later." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status. Please try again later." });
  }
};
