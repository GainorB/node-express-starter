const AuthController = require('../controllers/authController');
const ValidateUser = require('../services/validateUser');
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
      successRedirect: '/dashboard',
      failureRedirect: '/auth/invalid'
    })
  );

  // FACEBOOK CALL BACK
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/dashboard',
      failureRedirect: '/auth/invalid'
    })
  );

  // TWITTER CALL BACK
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/dashboard',
      failureRedirect: '/auth/invalid'
    })
  );

  // RENDER REGISTRATION FORM
  app.get('/auth/register', (req, res, next) =>
    res.render('register', { title: 'Registration' })
  );

  // REGISTER A USER
  app.post('/auth/register', ValidateUser.test, AuthController.newUser);

  // RENDER LOGIN FORM
  app.get('/auth/login', (req, res, next) =>
    res.render('login', { title: 'Login' })
  );

  // LOGIN
  app.post('/auth/login', ValidateUser.test, AuthController.LogIn);

  // FAILURE REDIRECT
  app.get('/auth/invalid', AuthController.invalidLogin);

  // LOGOUT
  app.get('/auth/logout', AuthController.logOut);
};
