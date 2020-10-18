const User = require("../models/user-model");
const City = require("../models/city-model");

// Get user
function getUserAsync(_id) {

    const user = User.findOne({ _id }).populate("city").exec();

    return user;

}

module.exports = {
    getUserAsync
};