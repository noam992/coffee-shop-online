const express = require("express");
const orderLogic = require("../business-logic/order-logic");
const errorHandler = require("../helpers/error-handler");
const Order = require("../models/order-model");
const isUserLogin = require("../middleware/is-user-logged-in");

const router = express.Router();

// Add order
router.post("/add-order", isUserLogin, async (request, response) => {
    try {

        const order = new Order(request.body);

        // Validate order data: 
        const error = await order.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        const addedOrder = await orderLogic.addOrderAsync(order)

        response.status(201).json({ addedOrder });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;