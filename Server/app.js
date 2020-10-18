global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
require("./data-access-layout/dal");
const express = require("express");
const authController = require("./controllers/auth-controller");
const userController = require("./controllers/user-controller");
const cityController = require("./controllers/city-controller");
const categoryController = require("./controllers/category-controller");
const productController = require("./controllers/product-controller");
const shoppingCartController = require("./controllers/shoppingCart-controller");
const chatController = require("./controllers/chat-controller");
const orderController = require("./controllers/order-controller");
const expressRateLimit = require("express-rate-limit");
const sanitize = require("./middleware/sanitize");
//const fs = require('fs');


// Command to operate on files into a defined path 
const path = require("path");

// Operation on folders
//const fs = require("fs");

// Upload files into static folder
const fileUpload = require("express-fileupload"); 
// if "./uploads" doesn't exist: 
//if (!fs.existsSync("./uploads")) {
//    fs.mkdirSync("./uploads");
//}

const server = express();

// Security - limit the numbers of request by same ip address 
server.use("/api/", expressRateLimit({
    windowMs: 1000, // 1 second
    max: 5, // Limit each IP to 5 request per windowMs
    message: "Too many requests for short period time"
}));

// Serve index.html: 
server.use(express.static(path.join(__dirname, "./_front-end")));

server.use(express.json());

// Security - clean tags and any scopes which is insert into input boxes on client side
server.use(sanitize);
server.use(fileUpload());
server.use('/upload', express.static('uploads'));
server.use("/api/auth", authController);
server.use("/api/user", userController);
server.use("/api/city", cityController);
server.use("/api/category", categoryController);
server.use("/api/product", productController);
server.use("/api/shoppingCart", shoppingCartController);
server.use("/api/chat", chatController);
server.use("/api/order", orderController);

server.listen(3000, () => console.log("Listening on http://localhost:3000"));


