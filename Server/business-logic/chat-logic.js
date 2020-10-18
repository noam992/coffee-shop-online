const Chat = require("../models/chat-model");
const Message = require("../models/message-model");


// Get specific chat
function getSpecificChatAsync(_userId) {

    const chat = Chat.findOne({ userId: _userId }).exec();

    return chat;

}
 
// Add chat 
function addChatAsync(chat) {

    return chat.save();

}


// Get messages 
function getMessagesAsync(_chatId) {

    return messages = Message.find({ chatId: _chatId }).exec();

}

// Add message 
function addMessageAsync(message) {

    return message.save();

}

// Delete message 
function deleteMessageAsync( _id ) {

    return Message.deleteOne({ _id })    

}

module.exports = {
    getSpecificChatAsync,
    addChatAsync,
    getMessagesAsync,
    addMessageAsync,
    deleteMessageAsync
};