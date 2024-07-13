const {Jwt} = require( "./Jwt");

const {getExpirationDate} = require("./utils/DateUtils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
function generateJwtToken(body, header = {typ: "JWT", alg: "SHA256"}) {
    const accessTokenJwtObject = new Jwt(header, body)
    accessTokenJwtObject.sign(JWT_SECRET_KEY)
    return accessTokenJwtObject.encodedAndSigned();
}

function getRefreshTokenExpirationDate() {
    return getExpirationDate(1, 0, 0, 0);
}

function getAccessTokenExpirationDate() {
    return getExpirationDate(0, 0, 1, 0);
}


function getJwtTokenAndVerificationResult (jwtToken){
    let isVerified = false;
    let decodedToken = null
    let message = ""
    if (jwtToken) {
        const verificationResult = Jwt.verifySignature(jwtToken, JWT_SECRET_KEY)
        if (verificationResult) {
            isVerified = true;
            const jwtObject = Jwt.fromEncodedAndSignedJwt(jwtToken)
            decodedToken = jwtObject.getDecoded()
        } else {
            message = 'token verification failed!'
        }
    } else {
        message = 'no token found'
    }
    return {
        decodedToken: decodedToken,
        encodedToken: jwtToken,
        isVerified: isVerified,
        message: message
    }
}

function getRefreshTokenCookieOptions(expirationDate) {
    return {
        sameSite: "none",
        path: '/',
        expires: expirationDate,
        secure: true,
        httpOnly: true
    };
}

module.exports = {
    generateJwtToken,
    getRefreshTokenExpirationDate,
    getAccessTokenExpirationDate,
    getJwtTokenAndVerificationResult,
    getRefreshTokenCookieOptions
}

