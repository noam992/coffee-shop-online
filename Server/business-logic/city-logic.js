const City = require("../models/city-model");

// Get cities
function getCitiesAsync() {

    const cities = City.find().exec();

    return cities;

}

module.exports = {
    getCitiesAsync
};