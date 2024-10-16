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
const express_session_2 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pool_1 = __importDefault(require("./db/pool"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
if (!process.env.SESSION_SECRET) {
    throw Error('Session Secret must exist to continue');
}
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new ((0, connect_pg_simple_1.default)(express_session_2.default))({
        pool: pool_1.default, // Connection pool
        tableName: 'sessions',
        createTableIfMissing: true,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
}));
// import passport configurations
require("./config/passport");
app.use(passport_1.default.session());
app.use(express_1.default.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use('/', indexRouter_1.default);
app.use('*', (_req, res) => res.redirect('/'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
