const express = require("express");
const productLogic = require("../business-logic/product-logic");
const errorHandler = require("../helpers/error-handler");
const updateObjectHelper = require("../helpers/update-obj-from-other-obj");
const imageHandle = require("../helpers/image-handle");
const Product = require("../models/product-model");
const isUserLogin = require("../middleware/is-user-logged-in");
const isAdmin = require("../middleware/is-admin");
const mongodb = require("mongodb");

const binary = mongodb.Binary

const router = express.Router();

// Get products
router.get("/", async (request, response) => {
    try {

        const products = await productLogic.getAllProductsAsync();

        response.json({ products });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Get specific product --> permitted for admin and user
router.get("/:_id", isUserLogin, async (request, response) => {
    try {

        const _id = request.params._id;
        const product = await productLogic.getSpecificProductAsync(_id)

        response.json({ product });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Add products
router.post("/add-product", isAdmin, async (request, response) => {
    try {

        const product = new Product({
            productName: request.body.productName,
            productText: request.body.productText,
            productImg: binary(request.files.productImg.data),
            productImgType: request.files.productImg.mimetype,
            price: request.body.price,
            categoryId: request.body.categoryId
        });

        // Validate product data: 
        const error = await product.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        const productAdded = await productLogic.addProductAsync(product);

        response.status(201).json({ productAdded });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Update products
router.patch("/update-product/:_id", isAdmin, async (request, response) => {
    try {

        // Get previous product
        const _id = request.params._id;
        const previousProduct = await productLogic.getSpecificProductAsync( _id );

        // If Admin change the image, if no take the image from previous product
        if (request.files !== null && request.files.editProductImg) {

            // Image changed
            previousProduct.productImg = binary(request.files.editProductImg.data)
            previousProduct.productImgType = request.files.editProductImg.mimetype
            previousProduct.productName = request.body.editProductName
            previousProduct.productText = request.body.editProductText
            previousProduct.price = request.body.editPrice
            previousProduct.categoryId = request.body.editProductCategoryId
            
        } else {
            
            // Image didn't change
            previousProduct.productName = request.body.editProductName
            previousProduct.productText = request.body.editProductText
            previousProduct.price = request.body.editPrice
            previousProduct.categoryId = request.body.editProductCategoryId

        }

        // Validate product data:
        const error = await previousProduct.validate()
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        // Save previous product (with new value) in DB
        const productUpdated = await productLogic.updateProductAsync(previousProduct);
        if (!productUpdated) {
            response.status(400).send(errorHandler.getError(!productUpdated));
            return;
        }

        response.json({ productUpdated });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Delete products
router.delete("/delete-product/:_id", async (request, response) => {
    try {
        const _id = request.params._id;
        await productLogic.deleteProductAsync(_id);

        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;