const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({

    totalPrice: {
        type: Number,
        required: [true, "Missing total price"],
        min: [0, "Total price can't be negative"]
    },

    address: {
        type: String,
        required: [true, "Missing address"],
        minlength: [1, "Address too short"],
        maxlength: [100, "Address too long"]
    },

    orderTime: {
        type: String,
        required: [true, "Missing order time"],
        validate: {
            validator: value => /^20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/.test(value),
            message: "Require time and date value. yyyy/xx/xx HH:MM(format) | yyyy-xx-xxTHH:MM(format)"
        }
    },

    deliveryTime: {
        type: String,
        required: [true, "Missing delivery time"],
        validate: {
            validator: value => /^20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/.test(value),
            message: "Require time and date value. yyyy/xx/xx HH:MM(format) | yyyy-xx-xxTHH:MM(format)"
        }
    },

    lastFourNumOfCard: {
        type: Number,
        required: [true, "Missing last four numbers of card"],
        validate: {
            validator: value => /^\d{4}$/.test(value),
            message: "Require last four numbers of card. xxxx(format)"
        }
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user id"],
        ref: "User"
    },

    shoppingCartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing shopping cart id"],
        ref: "ShoppingCart"
    },

    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing city id"],
        ref: "City"
    }

}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});


OrderSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});


OrderSchema.virtual("shoppingCart", {
    ref: "ShoppingCart",
    localField: "shoppingCartId",
    foreignField: "_id",
    justOne: true,
});


OrderSchema.virtual("city", {
    ref: "City",
    localField: "cityId",
    foreignField: "_id",
    justOne: true,
});


const Order = mongoose.model("Order", OrderSchema, "Orders");

module.exports = Order;