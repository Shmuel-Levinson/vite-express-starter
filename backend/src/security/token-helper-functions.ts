import {nowWithDelta} from "../utils/DateUtils";

const {Jwt} = require( "./Jwt");

const {getExpirationDate} = require("../utils/DateUtils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
function generateJwtToken(body: any, header = {typ: "JWT", alg: "SHA256"}) {
    const accessTokenJwtObject = new Jwt(header, body)
    accessTokenJwtObject.sign(JWT_SECRET_KEY)
    return accessTokenJwtObject.encodedAndSigned();
}

export function calculateRefreshTokenExpirationDate() {
    return nowWithDelta({minutes: 5});
}

export function calculateAccessTokenExpirationDate() {
    return nowWithDelta({seconds: 15});
}


function getJwtTokenAndVerificationResult (jwtToken: any){
    let isVerified = false;
    let decodedToken = null
    let message = ""
    if (jwtToken) {
        const verificationResult = Jwt.verifySignature(jwtToken, JWT_SECRET_KEY)
        if (verificationResult) {
            isVerified = true;
            const jwtObject = Jwt.decode(jwtToken)
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

function getRefreshTokenCookieOptions(expirationDate: any) {
    return {
        sameSite: "none",
        path: '/',
        expires: expirationDate,
        secure: true,
        httpOnly: true
    };
}

export function httpOnlyCookieOptions(expirationDate: Date) {
    return {
        // sameSite: "none",
        // path: '/',
        expires: expirationDate,
        // secure: true,
        httpOnly: true
    };
}

export function refreshTokenCookieOptions() {
    return httpOnlyCookieOptions(calculateRefreshTokenExpirationDate())
}

export function accessTokenCookieOptions() {
    return httpOnlyCookieOptions(calculateAccessTokenExpirationDate())
}
