const express = require("express");
const categoryLogic = require("../business-logic/category-logic");
const errorHandler = require("../helpers/error-handler");

const router = express.Router();

router.get("/", async (request, response) => {
    try {

        // Get categories
        const categories = await categoryLogic.getCategoriesAsync();

        response.json({ categories });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;