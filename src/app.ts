import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import indexRouter from './routes/indexRouter';
import session from 'express-session';
import passport from 'passport';
import expressSession from 'express-session';
import connectPg from 'connect-pg-simple';
import pool from './db/pool';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
  throw Error('Session Secret must exist to continue');
}

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new (connectPg(expressSession))({
      pool: pool, // Connection pool
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    },
  }),
);

// import passport configurations
import './config/passport';

app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', indexRouter);
app.use('*', (_req, res) => res.redirect('/'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
