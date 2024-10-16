import * as db from '../db/queries';
import { Request, Response } from 'express';
import { genPassword } from '../lib/passwordUtils';

export async function indexGet(req: Request, res: Response) {
  const messages = await db.getAllMessages();
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log('here');
    console.log(req.user);
    console.log(req.user.username);
    res.render('index', {
      isAuth: true,
      isMember: req.user.member,
      username: req.user.username,
      messages,
    });
  } else {
    res.render('index', { messages });
  }
}

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
      return res.redirect('/profile');
    });
  } catch (error) {
    console.error(error);
    req.session.messages = [error.message];
    return res.redirect('/register');
  }
}

export async function memberPost(req: Request, res: Response) {
  if (req.body.password && req.body.password === 'secret') {
    await db.makeMember(req.user.id);
  }
  res.redirect('/profile');
}

export async function newMessagePost(req: Request, res: Response) {
  if (!req.body.message || !req.user.id) return res.redirect('/');

  await db.addMessage(req.user.id, req.body.message);
  res.redirect('/');
}
