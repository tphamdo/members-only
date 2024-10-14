"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('<h1>Home</h1><a href="/login">Login</a>');
});
router.get('/login', (req, res) => {
    res.send(`
    <form method="post" action="/login">
      <div><label>Username:</label><input type="text" name="username" /></div>
      <div><label>Password:</label><input type="password" name="password" /></div>
      <div><button type="submit">Log In</button></div>
    </form>
  `);
});
router.post('/login', [
    (req, res, next) => {
        console.log('login post');
        next();
    },
    passport_1.default.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
    }),
]);
router.get('/profile', (req, res) => {
    var _a;
    if (!req.isAuthenticated()) {
        console.log('profile is not authenticated');
        return res.redirect('/login');
    }
    console.log(req.user);
    res.send(`<h1>Hello, ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.username} </h1><a href="/logout">Logout</a>`);
});
router.get('/logout', (req, res) => {
    req.logout(() => { });
    res.redirect('/');
});
exports.default = router;
