const AuthController = require('../controllers/authController');
const passport = require('passport');

module.exports = app => {
  // USERS CLICKS THESE ROUTES TO GET REDIRECTED TO SOCIAL LOGIN
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // GOOGLE CALL BACK
  app.get(
    '/google/oauth2callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/auth/invalid'
    })
  );

  // FACEBOOK CALL BACK
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/auth/invalid'
    })
  );

  // TWITTER CALL BACK
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/auth/invalid'
    })
  );

  // FAILURE REDIRECT
  // app.get('/auth/invalid', AuthController.invalidLogin);

  // LOGOUT
  // app.get('/auth/logout', AuthController.logOut);
};
