"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUserById = getUserById;
exports.makeMember = makeMember;
exports.addMessage = addMessage;
exports.getAllMessages = getAllMessages;
exports.getUserMessages = getUserMessages;
const pool_1 = __importDefault(require("./pool"));
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    INSERT INTO users (username, hash, salt)
    VALUES ($1, $2, $3);
  `;
        const existingUser = yield getUser(user.username);
        if (existingUser)
            throw Error('That username already exists');
        const rows = yield pool_1.default.query(SQL, [user.username, user.hash, user.salt]);
    });
}
function getUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT * FROM users
    WHERE users.username = $1
  `;
        const { rows } = yield pool_1.default.query(SQL, [username]);
        if (rows.length > 1)
            console.error(`Found more than one user with the same username: ${rows[0]}`);
        return rows.length ? rows[0] : undefined;
    });
}
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT * FROM users
    WHERE users.id = $1
  `;
        const { rows } = yield pool_1.default.query(SQL, [userId]);
        if (rows.length > 1)
            console.error(`Found more than one user with the same username: ${rows[0]}`);
        return rows.length ? rows[0] : undefined;
    });
}
function makeMember(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    UPDATE users
    SET member = true
    WHERE users.id = $1;
  `;
        yield pool_1.default.query(SQL, [userId]);
    });
}
function addMessage(userId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    INSERT INTO messages (fromUserId, message, added)
    VALUES ($1, $2, NOW());
  `;
        yield pool_1.default.query(SQL, [userId, message]);
    });
}
function getAllMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT m.message, u.username, m.added FROM messages as m
    INNER JOIN users as u
    ON m.fromUserId = u.id
    ORDER BY m.added DESC;
  `;
        const { rows } = yield pool_1.default.query(SQL);
        return rows;
    });
}
function getUserMessages(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT m.message, u.username, m.added FROM messages as m
    INNER JOIN users as u
    ON m.fromUserId = u.id
    WHERE m.fromUserId = $1
    ORDER BY m.added DESC;
  `;
        const { rows } = yield pool_1.default.query(SQL, [userId]);
        return rows;
    });
}
