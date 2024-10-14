import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../db/pool';

export interface User {
  username: string;
  password: string;
}

// User database simulation
const users: User[] = [];
users.push({ username: 'test', password: '123' });

// Passport local strategy
passport.use(
  new LocalStrategy((username: string, password: string, done: Function) => {
    console.log('using local strategy');
    console.log('username: ', username);
    console.log('password: ', password);
    const user = users.find((user) => user.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }),
);

// Serialize and deserialize user
passport.serializeUser((user: User, done: Function) => {
  console.log('seralizing user');
  done(null, user.username);
});

passport.deserializeUser((username: string, done: Function) => {
  console.log('deseralizing user');
  const user = users.find((user) => user.username === username);
  done(null, user);
});
