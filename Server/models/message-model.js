const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({

    message: {
        type: String,
        required: [true, "Message does not exist"],
        minlength: [1, "Message too short"],
        maxlength: [500, "message too long"]
    },

    messageTime: {
        type: String,
        required: [true, "Missing Time"],
        validate: {
            validator: value => /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/.test(value),
            message: "Require time value. HH:MM(format)"
        }
    },

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing id chat that related to the message"],
        ref: "Chat"
    }

}, { 
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

MessageSchema.virtual("chat", {
    ref: "Chat",
    localField: "chatId",
    foreignField: "_id",
    justOne: true,
})

const Message = mongoose.model("Message", MessageSchema, "Messages");

module.exports = Message;