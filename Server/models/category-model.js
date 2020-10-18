const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({

    category: {
        type: String,
        required: [true, "Missing category"]
    }

}, { versionKey: false });


const Category = mongoose.model("Category", CategorySchema, "Categories");

module.exports = Category;