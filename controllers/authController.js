const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  // REGISTER A NEW USER
  newUser(req, res, next) {
    // EXTRACT FORM DATA
    const { username, email, password } = req.body;

    // INSERT USER DATA INTO AN OBJECT
    let newUser = { username, email, password };

    // CREATE A TOKEN
    const token = jwt.sign(newUser, process.env.SECRET_KEY, {
      expiresIn: 604800 // 1 WEEK
    });

    // USE MODEL TO REGISTER A NEW USER
    User.addUser(newUser, token)
      .then(user => {
        req.login(user, err => {
          if (err) return next(err);
          req.flash(
            'success',
            'You are now registered, check your email for a confirmation email.'
          );
          res.redirect('/auth/dashboard');
        });
      })
      .catch(err =>
        res.json({ status: false, msg: 'Error registering user', err })
      );
  },

  // USER PROFILE
  dashboard(req, res) {
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
