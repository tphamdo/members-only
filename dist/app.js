"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
if (!process.env.SESSION_SECRET) {
    throw Error('Session Secret must exist to continue');
}
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
}));
// import passport configurations
require("./config/passport");
app.use(passport_1.default.session());
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    console.log('here');
    next();
});
app.use('/', indexRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
