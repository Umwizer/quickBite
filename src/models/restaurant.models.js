import {Schema,model}from 'mongoose';

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    menu: [{
        itemName: {
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
        },}],
    openingHours: {
        type: String,
        required: true,
    },
    deliveryOptions: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const restaurantModel = model('restaurant',restaurantSchema);
export default restaurantModel;

