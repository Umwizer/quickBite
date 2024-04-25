import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    }],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Delivered'],
        default: 'Pending',
    },
}, { timestamps: true });

const Order = model('Order', orderSchema);

export default Order;
