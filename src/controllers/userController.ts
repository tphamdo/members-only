import * as db from '../db/queries';
import { Request, Response } from 'express';
import { genPassword } from '../lib/passwordUtils';

export async function registerUserPost(req: Request, res: Response) {
  if (!req.body.username || !req.body.password) res.redirect('/login');

  const hashedPassword = genPassword(req.body.password);

  db.addUser({
    username: req.body.username,
    hash: hashedPassword.hash,
    salt: hashedPassword.salt,
  });

  res.redirect('/login');
}
