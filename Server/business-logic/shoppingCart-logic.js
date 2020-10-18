const ShoppingCart = require("../models/shopping-cart-model");
const ItemCart = require("../models/item-cart-model");
const User = require("../models/user-model");
const Product = require("../models/product-model");
const Category = require("../models/category-model");


// Get current shopping cart related to user 
function getShoppingCartAsync( _userId ) {

    const cart = ShoppingCart.findOne({ userId: _userId }).populate("user").exec();

    return cart;

}

// Add cart 
async function addShoppingCartAsync(shoppingCart) {

    await shoppingCart.save();

    const shoppingCartJson = await ShoppingCart.findOne({ userId: shoppingCart.userId }).populate("user").exec();

    return shoppingCartJson;
}

// Delete cart and relate item of current cart
async function deleteCartAsync( _id ) {

    const cart = await ShoppingCart.findOne({ _id }).exec();

    await ShoppingCart.deleteOne({ _id: cart._id }).exec();
    await ItemCart.deleteMany({ shoppingCartId: cart._id }).exec();   
    return
}

// Get all items are relating to cart 
function getAllItemsRelateToCartAsync(_cartId) {

    return itemsCart = ItemCart.find({ shoppingCartId: _cartId }).populate("product").exec();

}

// Get specific item 
function getSpecificItemAsync(_id) {

    const itemCartJson = ItemCart.findOne({ _id }).populate("product").populate("shoppingCart").exec();
    
    return itemCartJson;

}

// Add item's cart 
async function addItemRelatedToCartAsync(itemCart) {

    await itemCart.save();

    const itemCartJson = await ItemCart.findOne({ _id: itemCart._id }).populate("product").populate("shoppingCart").exec();

    return itemCartJson;

}

// Update item's cart 
async function updateItemRelatedToCartAsync( updateItemCart ) {

    await updateItemCart.save();

    return await ItemCart.findOne({ _id: updateItemCart._id }).populate("product").populate("shoppingCart").exec();

}

// Delete item, which related to cart
function deleteItemRelatedToCartAsync( _id ) {

    return ItemCart.deleteOne({ _id: _id }).exec();

}



module.exports = {
    getShoppingCartAsync,
    addShoppingCartAsync,
    deleteCartAsync,
    getAllItemsRelateToCartAsync,
    getSpecificItemAsync,
    addItemRelatedToCartAsync,
    updateItemRelatedToCartAsync,
    deleteItemRelatedToCartAsync
};