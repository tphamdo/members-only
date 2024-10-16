import express from 'express';
import passport from 'passport';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', userController.indexGet);

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

router.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    {
      failureMessage: true,
    },
    (err, user, info) => {
      if (err || !user) {
        // failureRedirect
        if (info && info.message) {
          req.session.messages = [info.message];
        }
        req.session.save((_err) => {
          return res.redirect('/login');
        });
      } else {
        // successRedirect
        req.login(user, () => {
          res.redirect('/');
        });
      }
    },
  )(req, res);
});

router.get('/profile', userController.profileGet);
router.get('/profile/:username', userController.profileUsernameGet);

router.post('/member', userController.memberPost);
router.post('/newMessage', userController.newMessagePost);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
