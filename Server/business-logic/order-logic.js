const Order = require("../models/order-model");
const ShoppingCart = require("../models/shopping-cart-model");
const User = require("../models/user-model");
const City = require("../models/city-model");

// Add order
async function addOrderAsync(order) {

    await order.save();
    
    const orderJson = await Order.findOne({ _id: order._id }).populate("user").populate("city").populate("shoppingCart").exec();

    return orderJson
}

module.exports = {
    addOrderAsync
};