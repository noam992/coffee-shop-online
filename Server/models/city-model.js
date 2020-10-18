const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({

    city_symbol: {
        type: String,
        required: [true, "Missing city"]
    },

    hebrew_name: String,

}, { versionKey: false });


const City = mongoose.model("City", CitySchema, "Cities");

module.exports = City;