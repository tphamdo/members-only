import * as db from '../db/queries';
import { Request, Response } from 'express';
import { genPassword } from '../lib/passwordUtils';

export async function indexGet(req: Request, res: Response) {
  const messages = await db.getAllMessages();
  if (req.isAuthenticated && req.isAuthenticated()) {
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

export async function profileGet(req: Request, res: Response) {
  if (!req.isAuthenticated()) return res.redirect('/login');

  const userMessages = await db.getUserMessages(req.user.id);

  res.render('profile', {
    username: req.user.username,
    isMember: req.user.member,
    messages: userMessages,
    isOwnProfile: true,
    profileUsername: req.user.username,
  });
}

export async function profileUsernameGet(req: Request, res: Response) {
  if (!req.isAuthenticated()) return res.redirect('/login');
  if (!req.params.username || !req.user.member) return res.redirect('/');

  const user = await db.getUser(req.params.username);
  if (!user) return res.redirect('/');

  const profileMessages = await db.getUserMessages(user.id);
  res.render('profile', {
    username: req.user.username,
    isMember: req.user.member,
    messages: profileMessages,
    profileUsername: req.params.username,
  });
}
