const hash = require("../helpers/hash");
const User = require("../models/user-model");
const City = require("../models/city-model");

// Register user logic
async function registerAsync(user) {

    // Replace user password to hash user password 
    user.password = hash(user.password);
    
    // Save user into DB
    await user.save();

    const userJson = await User.findOne({ email: user.email }).populate("city").exec();
    
    return userJson;
}

// First step from register process
async function registerCheckFirstStepAsync(user) {

    const isUser = await User.findOne({ email: user.email }).exec();

    return isUser;
}

async function loginAsync(credentials) {
    
    // Hash user password:
    credentials.password = hash(credentials.password);
    const user = await User.findOne({ email: credentials.email, password: credentials.password }).populate("city").exec();

    return user;
}

module.exports = {
    registerAsync,
    registerCheckFirstStepAsync,
    loginAsync
};