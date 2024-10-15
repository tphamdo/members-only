import express from 'express';
import passport from 'passport';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.send(
      `<h1>Home to ${req.user.username}!</h1><a href="/profile">Profile</a>`,
    );
  } else {
    res.send(
      '<h1>Home</h1><a href="/login">Login</a><a href="/register">Register</a>',
    );
  }
});

router.get('/login', (req, res) => {
  const errors = req.session.messages ? [...req.session.messages] : null;
  req.session.messages = undefined;
  res.render('login', { errors });
});

router.get('/register', (req, res) => {
  const errors = req.session.messages ? [...req.session.messages] : null;
  req.session.messages = undefined;
  res.render('register', { errors });
});

router.post('/register', userController.registerUserPost);

router.post('/login', [
  (req, res, next: Function) => {
    console.log('login post');
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
  }),
]);

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    console.log('profile is not authenticated');
    return res.redirect('/login');
  }
  console.log(req.user);
  res.send(
    `<h1>Hello, ${req.user?.username} </h1><a href="/logout">Logout</a>`,
  );
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
