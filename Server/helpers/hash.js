const crypto = require("crypto");

const salt = "MakeThingsGoRight";

function hash(password) {

    // Hash password with salting: 
    return crypto.createHmac("sha512", salt).update(password).digest("hex");
}

module.exports = hash;
