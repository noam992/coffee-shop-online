const stripTags = require("striptags");

function sanitize(request, response, next) {

    // Run on the body - strip tags from any string property:
    for(const property in request.body) {
        if(typeof request.body[property] === "string") {
            request.body[property] = stripTags(request.body[property]);
        }
    }

    next();
}

module.exports = sanitize;