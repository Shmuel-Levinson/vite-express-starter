const sha = require("js-sha256")
import {ALPHABET} from "../utils/constants"

export const applySha = (text: string) => {
    return sha.sha256(text)
}

export const generateRandomString = (length = 10) => {
    const saltLength = length;
    let result = '';
    for (let i = 0; i < saltLength; ++i) {
        result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    return result;
}

export const generateSalt = () => {
    const randomString = generateRandomString()
    return applySha(randomString)
}

export const encodeObjectToBase64 = (object: object, encoding = 'utf8') => {
    const stringifiedJson = JSON.stringify(object)
    let buf = Buffer.from(stringifiedJson + encoding)
    return buf.toString("base64")
}

export const decodeObjectFromBase64 = (base64String: string) => {
    let buf = Buffer.from(base64String, "base64")
    const objectAsString = buf.toString('utf8')
    return JSON.parse(objectAsString.slice(0, -4))
}

export function shaPasswordWithSalt(password: string, salt: string) {
    return applySha(password + salt)
}