const Category = require("../models/category-model");

// Get categories
function getCategoriesAsync() {

    const categories = Category.find().exec();

    return categories;

}

module.exports = {
    getCategoriesAsync
};