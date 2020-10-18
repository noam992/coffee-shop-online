const express = require("express");
const cityLogic = require("../business-logic/city-logic");
const errorHandler = require("../helpers/error-handler");

const router = express.Router();

router.get("/", async (request, response) => {
    try {

        // Get cities
        const cities = await cityLogic.getCitiesAsync();

        response.json({ cities });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;