const express = require("express");
const userLogic = require("../business-logic/user-logic");
const errorHandler = require("../helpers/error-handler");

const router = express.Router();

router.get("/:_id", async (request, response) => {
    try {
        const _id = request.params._id
        let user = await userLogic.getUserAsync(_id)

        if (!user) {
            response.sendStatus(404);
            return
        }

        // Delete password
        user.password = undefined;

        // Send back user details
        response.json({ user });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;