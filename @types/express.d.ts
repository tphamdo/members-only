import Express from 'express';
import { User as MyUser } from '../src/config/passport.js';

declare global {
  namespace Express {
    interface User extends MyUser {}
  }
}
