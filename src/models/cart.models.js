import { Schema, model } from 'mongoose';

const menuItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'orderModel',
        required: true,
    },
}, { timestamps: true });

const CartItem = model('CartItem', menuItemSchema);

export default CartItem;
