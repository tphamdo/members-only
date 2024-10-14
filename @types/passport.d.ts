import Express from 'express';
import { User } from '../src/config/passport.ts';

declare global {
  namespace Express {
    export interface User {
      username: string;
    }
  }
}
