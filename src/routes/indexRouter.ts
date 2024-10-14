import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h1>Home</h1><a href="/login">Login</a>');
});

router.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <div><label>Username:</label><input type="text" name="username" /></div>
      <div><label>Password:</label><input type="password" name="password" /></div>
      <div><button type="submit">Log In</button></div>
    </form>
  `);
});

router.post('/login', [
  (req, res, next) => {
    console.log('login post');
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
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
  req.logout(() => {});
  res.redirect('/');
});

export default router;
