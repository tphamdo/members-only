import * as db from '../db/queries';
import { Request, Response } from 'express';
import { genPassword } from '../lib/passwordUtils';

export async function registerUserPost(req: Request, res: Response) {
  if (!req.body.username || !req.body.password) res.redirect('/login');

  const hashedPassword = genPassword(req.body.password);

  try {
    await db.addUser({
      username: req.body.username,
      hash: hashedPassword.hash,
      salt: hashedPassword.salt,
    });

    const user = await db.getUser(req.body.username);
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.session.messages = [err.message];
        return res.redirect('/register');
      }
      return res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    req.session.messages = [error.message];
    return res.redirect('/register');
  }
}

export async function memberPost(req: Request, res: Response) {
  console.log('---------memberPut----');
  console.log(req.user);
  console.log(req.body);
  console.log('---------memberPut----');
  if (req.body.password && req.body.password === 'secret') {
    db.makeMember(req.user.id);
  }
  res.redirect('/profile');
}
