const jwt = require("jsonwebtoken");

function isAdmin(request, response, next) {

    // If there is no authorization header: 
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged-in");
        return;
    }

    // User sends authorization header -- take the token
    // Format: "authorization": "Bearer the-token"
    const token = request.headers.authorization.split(" ")[1];

    // If there is not token:
    if (!token) {
        response.status(401).send("You are not logged-in");
        return;
    }

    // We have the token here - verify it:
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {

        // If token expired or not legal:
        if (err) {

            // If token expired: 
            if (err.message == "jwt expired") {
                response.status(403).send("Your login session has expired");
                return;
            }

            // Token not legal:
            response.status(401).send("You are not logged-in");
            return;
        }

        // Check if user is admin
        if (payload.user.isAdmin === 1){
            
            // Here the token is legal:
            next();
        }else{

            // User is not admin:
            response.status(401).send("You are not admin");
            return;
        }

    });
}

module.exports = isAdmin;