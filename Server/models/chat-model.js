const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({

    createdDate: {
        type: String,
        required: [true, "Missing date"],
        validate: {
            validator: value => /^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$/.test(value),
            message: "Require date value. xx/xx/yyyy(format)"
        }
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user"],
        ref: "User"
    }

}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

ChatSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
})

const Chat = mongoose.model("Chat", ChatSchema, "Chat");

module.exports = Chat;