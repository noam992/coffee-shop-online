const mongoose = require("mongoose");

const ShoppingCartSchema = mongoose.Schema({

    createdData: {
        type: String,
        required: [true, "Missing create time"],
        validate: {
            validator: value => /^20\d{2}(-|\/)((0[1-9])|(1[0-2]))(-|\/)((0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9])$/.test(value),
            message: "Require time and date value. yyyy/xx/xx HH:MM(format) | yyyy-xx-xxTHH:MM(format)"
        }
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user id"],
        ref: "User"
    }

}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

ShoppingCartSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
})

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema, "ShoppingCart");

module.exports = ShoppingCart;