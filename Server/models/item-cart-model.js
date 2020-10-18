const mongoose = require("mongoose");

const ItemCartSchema = mongoose.Schema({

    amount: {
        type: Number,
        required: [true, "Missing amount"],
        min: [1, "Amount can't be under 1"],
        max: [70, "Amount can't exceed 70"]
    },

    totalPriceByAmount:{
        type: Number,
        required: [true, "Missing total price"],
        min: [0, "Total price can't be negative"]
    },

    shoppingCartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing id cart that related to the item"],
        ref: "ShoppingCart"
    },
    
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing id product that related to the item"],
        ref: "Product"
    }


}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

ItemCartSchema.virtual("shoppingCart", {
    ref: "ShoppingCart",
    localField: "shoppingCartId",
    foreignField: "_id",
    justOne: true,
});

ItemCartSchema.virtual("product", {
    ref: "Product",
    localField: "productId",
    foreignField: "_id",
    justOne: true,
});


const ItemCart = mongoose.model("ItemCart", ItemCartSchema, "ItemsCart");

module.exports = ItemCart;