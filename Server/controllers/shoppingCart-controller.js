const express = require("express");
const shoppingCartLogic = require("../business-logic/shoppingCart-logic");
const productLogic = require("../business-logic/product-logic");
const errorHandler = require("../helpers/error-handler");
const ShoppingCart = require("../models/shopping-cart-model");
const ItemCart = require("../models/item-cart-model");
const totalPriceHelper = require("../helpers/sum-by-price-and-amount");
const updateObjectHelper = require("../helpers/update-obj-from-other-obj");
const isUserLogin = require("../middleware/is-user-logged-in");

const router = express.Router();

// Get current shopping cart
router.get("/:_userId", isUserLogin, async (request, response) => {
    try {
        const _userId = request.params._userId;

        const shoppingCart = await shoppingCartLogic.getShoppingCartAsync( _userId )

        response.json({ shoppingCart });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Add shopping cart
router.post("/add-cart", isUserLogin, async (request, response) => {
    try {
        const shoppingCart = new ShoppingCart(request.body);

        // Validate shopping cart data: 
        const error = await shoppingCart.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        const shoppingAdded = await shoppingCartLogic.addShoppingCartAsync(shoppingCart);

        response.status(201).json({ shoppingAdded });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Delete shopping cart
router.delete("/delete-cart/:_id", isUserLogin, async (request, response) => {
    try {
        const _id = request.params._id;
        await shoppingCartLogic.deleteCartAsync(_id);

        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Get items are relating to cart
router.get("/items/:_cartId", isUserLogin, async (request, response) => {
    try {
        const _cartId = request.params._cartId;

        const itemsCart = await shoppingCartLogic.getAllItemsRelateToCartAsync(_cartId)

        response.json({ itemsCart });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Add item to cart
router.post("/add-item", isUserLogin, async (request, response) => {
    try {
        let item = new ItemCart(request.body);

        // Validate item data: 
        const error = await item.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        // Calculate total price by amount of current item
        const product = await productLogic.getSpecificProductAsync(item.productId);
        const totalItemPrice = totalPriceHelper.sumByPriceAndAmount(product.price, item.amount);
        item.totalPriceByAmount = totalItemPrice

        // Save new item
        const itemAdded = await shoppingCartLogic.addItemRelatedToCartAsync(item);

        response.status(201).json({ itemAdded });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Update item
router.patch("/update-item/:_id", isUserLogin, async (request, response) => {
    try {

        // Get previous item and current item
        const _id = request.params._id;
        const previousItem = await shoppingCartLogic.getSpecificItemAsync(_id)
        const currentItem = request.body;        

        // Update previous product
        const updatedItem = updateObjectHelper.updateObject(previousItem, currentItem);

        // Validate item data: 
        const error = await updatedItem.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        // Calculate total price by amount of current item
        const product = await productLogic.getSpecificProductAsync(updatedItem.productId);
        const totalItemPrice = totalPriceHelper.sumByPriceAndAmount(product.price, updatedItem.amount);
        updatedItem.totalPriceByAmount = totalItemPrice


        // Patch item
        const itemUpdated = await shoppingCartLogic.updateItemRelatedToCartAsync(updatedItem);
        if (!itemUpdated) {
            response.status(400).send(errorHandler.getError(!itemUpdated));
            return;
        }

        response.json({ itemUpdated });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Delete item
router.delete("/delete-item/:_id", isUserLogin, async (request, response) => {
    try {
        const _id = request.params._id;
        await shoppingCartLogic.deleteItemRelatedToCartAsync(_id);

        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;