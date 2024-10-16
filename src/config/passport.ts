import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as db from '../db/queries';
import { validPassword } from '../lib/passwordUtils';

export interface User {
  id: number;
  username: string;
  hash: string;
  salt: string;
  member: boolean;
  admin: boolean;
}

// Passport local strategy
passport.use(
  new LocalStrategy(
    async (username: string, password: string, done: Function) => {
      try {
        const user = await db.getUser(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        if (!validPassword(password, user.hash, user.salt)) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize and deserialize user
passport.serializeUser((user: User, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId: number, done: Function) => {
  try {
    const user = await db.getUserById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
