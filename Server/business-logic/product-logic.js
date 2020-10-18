const Product = require("../models/product-model");
const Category = require("../models/category-model");

// Get all products 
function getAllProductsAsync() {

    const products = Product.find().populate("category").exec();

    return products;

}

// Get specific product 
function getSpecificProductAsync( _id ) {

    const product = Product.findOne({ _id }).populate("category").exec();

    return product;

}

// Add product 
async function addProductAsync(product) {

    await product.save();

    const productJson = await Product.findOne({ _id: product._id }).populate("category").exec();

    return productJson;

}

// Update product 
async function updateProductAsync( updateProduct ) {

    await updateProduct.save();

    const productJson = await Product.findOne({ _id: updateProduct._id }).populate("category").exec();

    return productJson;

}

// Delete product 
function deleteProductAsync( _id ) {

    return Product.deleteOne({ _id }).exec();

}

module.exports = {
    getAllProductsAsync,
    getSpecificProductAsync,
    addProductAsync,
    updateProductAsync,
    deleteProductAsync
};