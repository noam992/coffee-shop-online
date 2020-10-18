// לטפל


function verifyCaptcha(request, response, next) {

    const token = request.header.authorization.split(" ")[1]

    // We have the token here - verify it:
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {

        console.log(payload.captchaText);

        // If token expired or not legal:
        if (err) {

            // If token expired: 
            if (err.message == "jwt expired") {
                response.status(403).send("Your captcha has expired");
                return;
            }

            // Token not legal:
            response.status(401).send("Your captcha are not correct");
            return;
        }

        // Check if user is admin
        if (payload.captchaText === 1){
            
            // Here the token is legal:
            next();
        }

    });




    if(request.body.captchaText !== request.session.captchaText) {
        response.status(400).send("CAPTCHA not valid!");
        return;
    }
    next();
}

module.exports = verifyCaptcha;