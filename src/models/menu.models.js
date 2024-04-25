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
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'RestaurantModel',
        required: true,
    },
}, { timestamps: true });

const MenuItem = model('MenuItem', menuItemSchema);

export default MenuItem;
