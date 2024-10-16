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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const userController = __importStar(require("../controllers/userController"));
const router = express_1.default.Router();
router.get('/', userController.indexGet);
router.get('/login', (req, res) => {
    const errors = req.session.messages ? [...req.session.messages] : null;
    req.session.messages = undefined;
    res.render('login', { errors });
});
router.get('/register', (req, res) => {
    const errors = req.session.messages ? [...req.session.messages] : null;
    req.session.messages = undefined;
    res.render('register', { errors });
});
router.post('/register', userController.registerUserPost);
router.post('/login', (req, res) => {
    passport_1.default.authenticate('local', {
        failureMessage: true,
    }, (err, user, info) => {
        if (err || !user) {
            // failureRedirect
            if (info && info.message) {
                req.session.messages = [info.message];
            }
            req.session.save((_err) => {
                return res.redirect('/login');
            });
        }
        else {
            // successRedirect
            req.login(user, () => {
                res.redirect('/');
            });
        }
    })(req, res);
});
router.get('/profile', userController.profileGet);
router.get('/profile/:username', userController.profileUsernameGet);
router.post('/member', userController.memberPost);
router.post('/newMessage', userController.newMessagePost);
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});
exports.default = router;
