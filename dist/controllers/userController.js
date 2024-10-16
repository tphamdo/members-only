"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexGet = indexGet;
exports.registerUserPost = registerUserPost;
exports.memberPost = memberPost;
exports.newMessagePost = newMessagePost;
exports.profileGet = profileGet;
exports.profileUsernameGet = profileUsernameGet;
const db = __importStar(require("../db/queries"));
const passwordUtils_1 = require("../lib/passwordUtils");
function indexGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield db.getAllMessages();
        if (req.isAuthenticated && req.isAuthenticated()) {
            res.render('index', {
                isAuth: true,
                isMember: req.user.member,
                username: req.user.username,
                messages,
            });
        }
        else {
            res.render('index', { messages });
        }
    });
}
function registerUserPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.username || !req.body.password)
            res.redirect('/login');
        const hashedPassword = (0, passwordUtils_1.genPassword)(req.body.password);
        try {
            yield db.addUser({
                username: req.body.username,
                hash: hashedPassword.hash,
                salt: hashedPassword.salt,
            });
            const user = yield db.getUser(req.body.username);
            req.login(user, (err) => {
                if (err) {
                    console.error(err);
                    req.session.messages = [err.message];
                    return res.redirect('/register');
                }
                return res.redirect('/profile');
            });
        }
        catch (error) {
            console.error(error);
            req.session.messages = [error.message];
            return res.redirect('/register');
        }
    });
}
function memberPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.password && req.body.password === 'secret') {
            yield db.makeMember(req.user.id);
        }
        res.redirect('/profile');
    });
}
function newMessagePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.message || !req.user.id)
            return res.redirect('/');
        yield db.addMessage(req.user.id, req.body.message);
        res.redirect('/');
    });
}
function profileGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.isAuthenticated())
            return res.redirect('/login');
        const userMessages = yield db.getUserMessages(req.user.id);
        res.render('profile', {
            username: req.user.username,
            isMember: req.user.member,
            messages: userMessages,
            isOwnProfile: true,
            profileUsername: req.user.username,
        });
    });
}
function profileUsernameGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.isAuthenticated())
            return res.redirect('/login');
        if (!req.params.username || !req.user.member)
            return res.redirect('/');
        const user = yield db.getUser(req.params.username);
        if (!user)
            return res.redirect('/');
        const profileMessages = yield db.getUserMessages(user.id);
        res.render('profile', {
            username: req.user.username,
            isMember: req.user.member,
            messages: profileMessages,
            profileUsername: req.params.username,
        });
    });
}
