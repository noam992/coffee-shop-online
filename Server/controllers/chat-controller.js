const express = require("express");
const chatLogic = require("../business-logic/chat-logic");
const errorHandler = require("../helpers/error-handler");
const Chat = require("../models/chat-model");
const Message = require("../models/message-model");

const router = express.Router();

// Get specific chat
router.get("/:_userId", async (request, response) => {
    try {

        const userId = request.params._userId;

        const chat = await chatLogic.getSpecificChatAsync(userId);

        response.json({ chat });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Add chat
router.post("/add-chat", async (request, response) => {
    try {

        const chat = new Chat(request.body);

        // Validate chat data: 
        const error = await chat.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }        
        
        const addedChat = await chatLogic.addChatAsync(chat);

        response.status(201).json({ addedChat });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

// Get specific message
router.get("/message/:_chatId", async (request, response) => {
    try {

        const _chatId = request.params._chatId;

        const message = await chatLogic.getMessageAsync(_chatId);

        response.json({ message });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


// Add message
router.post("/add-message", async (request, response) => {
    try {

        const message = new Message(request.body);

        // Validate message data: 
        const error = await message.validate();
        if (error) {
            response.status(400).send(errorHandler.getError(error));
            return;
        }    
        
        const addedMessage = await chatLogic.addMessageAsync(message);

        response.status(201).json({ addedMessage });
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});


// Delete message
router.delete("/delete-message/:_id", async (request, response) => {
    try {
      
        const _id = request.params._id
        await chatLogic.deleteMessageAsync(_id);

        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHandler.getError(err));
    }
});

module.exports = router;