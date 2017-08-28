const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  // REGISTER A NEW USER
  newUser(req, res) {
    // EXTRACT FORM DATA
    const { username, email, password } = req.body;

    // INSERT USER DATA INTO AN OBJECT
    let newUser = { username, email, password };

    // USE MODEL TO REGISTER A NEW USER
    User.addUser(newUser)
      .then(user => {
        // CREATE A TOKEN
        const token = jwt.sign(user, process.env.SECRET_KEY, {
          expiresIn: 604800 // 1 WEEK
        });

        req.flash('success', 'You are registered and can now login');

        // STORE TOKEN WHEN REGISTERING IN
        User.storeJWToken(token, user.id);

        res.redirect('/auth/dashboard');
      })
      .catch(err =>
        res.json({ status: false, msg: 'Error registering user', err })
      );
  },

  // USER PROFILE
  dashboard(req, res) {
    req.flash('info', 'Summary of your account below');
    res.render('dashboard', { title: 'Dashboard' });
  },

  // USER PROVIDES INVALID LOGIN DETAILS
  invalidLogin(req, res) {
    req.flash('error', 'Invalid credentials');
    res.redirect('/auth/login');
  },

  // LOGOUT
  logOut(req, res) {
    req.flash('success', 'You are now logged out');
    req.logout();
    res.redirect('/');
  }
};
