"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPassword = genPassword;
exports.validPassword = validPassword;
const crypto_1 = __importDefault(require("crypto"));
function genPassword(password) {
    var salt = crypto_1.default.randomBytes(32).toString('hex');
    var genHash = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');
    return {
        salt: salt,
        hash: genHash,
    };
}
function validPassword(password, hash, salt) {
    var hashVerify = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');
    return hash === hashVerify;
}
