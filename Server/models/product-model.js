const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({

    productName: {
        type: String,
        required: [true, "Missing product name"],
        minlength: [1, "name too short"],
        maxlength: [70, "name too long"]
    },

    productText: {
        type: String,
        required: [true, "Missing product text"]
    },

    productImg: {
        type: Buffer,
        required: [true, "Missing product name"]
    },

    productImgType: {
        type: String,
        required: [true, "Missing product image type"],
    },

    price: {
        type: Number,
        required: [true, "Missing amount"],
        min: [0, "price can't be negative"],
        max: [999999, "price can't exceed 999,999"]
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing category"],
        ref: "Category"
    }

}, { 
    versionKey: false,
    runValidators: true,
    toJSON: { virtuals: true },
    id: false
});

ProductSchema.virtual("productImgPath").get(function() {
    if (this.productImg !== null && this.productImgType !== null) {
        return `data:${this.productImgType};charset=utf-8;base64,${this.productImg.toString('base64')}`
    }
})

ProductSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id",
    justOne: true,
})

const Product = mongoose.model("Product", ProductSchema, "Products");

module.exports = Product;