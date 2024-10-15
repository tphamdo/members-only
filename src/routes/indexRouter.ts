import express from 'express';
import passport from 'passport';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log('is auth');
    res.render('index', { username: req.user.username });
  } else {
    res.render('index');
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

router.post('/member', userController.memberPost);

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('profile', {
    username: req.user.username,
    isMember: req.user.member,
  });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
