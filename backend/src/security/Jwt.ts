import sha from "js-sha256"
import {encodeObjectToBase64, decodeObjectFromBase64, generateRandomString} from "./SecurityUtils"
import {User} from "../models";
import {nowWithDelta} from "../utils/DateUtils";


export class Jwt {
    header: { typ: string; alg: string }
    body: object;
    encodedHeader: string;
    encodedBody: string;
    signature: string;

    constructor(header: { typ: string; alg: string }, body: object) {
        const encodedHeader = encodeObjectToBase64(header)
        const encodedBody = encodeObjectToBase64(body)
        this.header = header
        this.body = body
        this.encodedHeader = encodedHeader
        this.encodedBody = encodedBody
        this.signature = ""

    }

    static decode(encodedAndSignedJwt: string) {
        const encodedHeader = encodedAndSignedJwt.split(".")[0]
        const encodedBody = encodedAndSignedJwt.split(".")[1]
        const decodedHeader = decodeObjectFromBase64(encodedHeader)
        const decodedBody = decodeObjectFromBase64(encodedBody)
        return new Jwt(decodedHeader, decodedBody)
    }

    static decodeHeaderAndBody(encodedAndSignedJwt: string) {
        const encodedHeader = encodedAndSignedJwt.split(".")[0]
        const encodedBody = encodedAndSignedJwt.split(".")[1]
        const decodedHeader = decodeObjectFromBase64(encodedHeader)
        const decodedBody = decodeObjectFromBase64(encodedBody)
        return {header: decodedHeader, body: decodedBody}
    }

    static createSignature(encodedHeader: string, encodedBody: string, secretKey: any) {
        return sha.sha256(encodedHeader + encodedBody + secretKey);
    }

    sign(secretKey: string | undefined) {
        this.signature = Jwt.createSignature(this.encodedHeader, this.encodedBody, secretKey)
    }

    getDecoded() {
        return {
            header: this.header,
            body: this.body,
        }
    }

    encodedAndSigned() {
        return this.encodedHeader + "." + this.encodedBody + "." + this.signature
    }

    static verifySignature(encodedAndSignedJwt: string, secretKey: string | undefined) {
        const encodedHeader = encodedAndSignedJwt.split(".")[0]
        const encodedBody = encodedAndSignedJwt.split(".")[1]
        const providedSignature = encodedAndSignedJwt.split(".")[2]
        const expectedSignature = Jwt.createSignature(encodedHeader, encodedBody, secretKey)
        return expectedSignature === providedSignature
    }
}
export function getTokenCookiesPair(user: User) {
    const refreshToken = new Jwt(
        {
            typ: '',
            alg: 'sha'
        },
        {
            id: user.id,
            role: 'user',
            nonce: 'rt_' + generateRandomString(5),
            expires: nowWithDelta({seconds: 10})
        })
    const accessToken = new Jwt(
        {
            typ: '',
            alg: 'sha'
        },
        {
            id: user.id,
            role: 'user',
            nonce: 'at_' + generateRandomString(5),
            expires: nowWithDelta({seconds: 10})
        })

    refreshToken.sign(process.env.JWT_SECRET_KEY);
    accessToken.sign(process.env.JWT_SECRET_KEY);
    return {rtCookie: refreshToken.encodedAndSigned(), atCookie: accessToken.encodedAndSigned()};
}
export function runJwtTest() {
    console.log("hello world")
    const SECRET_KEY = process.env.JWT_SECRET_KEY
    const header = {typ: "JWT", alg: "SHA256"}
    const body = {isAdmin: false, permissions: {lists: 4, users: 0}}
    const jwt = new Jwt(header, body)
    jwt.sign(SECRET_KEY)
    console.log("real jwt: ", jwt.getDecoded())
    const realEncodedJwt = jwt.encodedAndSigned()
    console.log("real encoded and signed jwt:\n", realEncodedJwt)
    const actualSignature = jwt.signature
    console.log("real encoded jwt passes verification: ", Jwt.verifySignature(realEncodedJwt, SECRET_KEY))

    const temperedBody = {isAdmin: true, permissions: {lists: 4, users: 4}}
    const temperedJwt = {header: header, body: temperedBody}
    console.log("tempered jwt: ", temperedJwt)
    const fakeEncodedJwt = encodeObjectToBase64(header) + "." + encodeObjectToBase64(temperedBody) + "." + actualSignature
    console.log("tempered encoded and signed jwt (using stolen signature):\n", fakeEncodedJwt)
    console.log("tempered encoded jwt passes verification: ", Jwt.verifySignature(fakeEncodedJwt, SECRET_KEY))
}