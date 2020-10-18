const express = require("express");
const authLogic = require("../business-logic/auth-logic");
const errorHandler = require("../helpers/error-handler");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const verifyCaptcha = require("../middleware/verify-captcha");
const User = require("../models/user-model");
const validator = require('validator');

const router = express.Router();

// Get captcha for user register process
router.get("/captcha", (request, response) => {

    // Create a new Captcha: 
    const captcha = svgCaptcha.create();
    const captchaText = captcha.text;
    const captchaImage = captcha.data;

    // Save the text in the token:
    const token = jwt.sign({ captchaText }, config.jwt.secretKey, { expiresIn: "30m" })

    // Send back to client the image and jwt of captcha text 
    response.type("svg").send(captchaImage).json(token);;
});


// Check step one of register process 
router.post("/register/stepOne", async (request, response) => {
    try {

        const user = new User({
            email: request.body.email,
            identityCard: request.body.identityCard,
            password: request.body.password
        });

        // Validate user data for first step
        let errors = {
            emailError: Boolean,
            identityCardError: Boolean,
            passwordError: Boolean,
        }
        errors.emailError = validator.isEmail(user.email);
        errors.identityCardError = validator.isLength(user.identityCard.toString(), {
            min: 9,
            max: 9
        });
        errors.passwordError = validator.matches(user.password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        
        // Check properties of error - if one equal false return false
        for (const error in errors) {
            if(errors[error] === false) {
                response.status(400).send(errorHandler.getError("Have a false in one parameter of first step register"));
                return;
              }
        }

        // Check if user exist
        const isUser = await authLogic.registerCheckFirstStepAsync(user)

        // If user exist return user details
        if (isUser) {
            response.status(200).json({ isUser });
            return;
        }

        // Good process return status 201 (created)
        response.status(201).json({ user });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Register user --> Add middleware  ", verifyCaptcha" 
router.post("/register", async (request, response) => {
    try {

        const user = new User(request.body);
        user.isAdmin = 0

        // Validate user data: 
        const error = await user.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }

        const newUser = await authLogic.registerAsync(user);

        // Delete password
        newUser.password = undefined;

        // Create a new JWT:
        const token = jwt.sign({ newUser }, config.jwt.secretKey, { expiresIn: "30m" });

        // Send back user object AND the JWT token:
        response.status(201)
            .header("CoffeeOnlineShop", token)
            .json({ newUser });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

router.post("/login", async (request, response) => {
    try {
        const user = await authLogic.loginAsync(request.body);
        
        if (!user) {
            response.status(401).send("Incorrect username or password");
            return;
        }

        // Delete password
        user.password = undefined;

        // Create a new JWT:
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" });

        // Send back user object AND the JWT token:
        response
            .header("CoffeeOnlineShop", token)
            .json({ user });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;