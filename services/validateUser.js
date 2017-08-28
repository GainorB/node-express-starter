const User = require('../models/user');

const Validate = {};

Validate.test = (req, res, next) => {
  // EXTRACT FORM DATA
  const { username, email, password } = req.body;

  // CHECK FOR ERRORS
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('email', 'Email is required.').isEmail();

  // VALIDATION ERRORS
  let errors = req.validationErrors();

  if (errors) {
    res.render('register', { errors, title: 'Registration' });
  }

  // CHECK EMAIL IF IT IS FORMATTED CORRECTLY
  if (!User.validateEmail(email)) {
    return req.flash('error', "Email isn't formatted correctly");

    next();
  }

  return next();
};

// CHECK IF USER IS AUTHENTICATED
Validate.isAuthenticated = (req, res, next) => {
  if (!req.user) return res.redirect('/auth/login');
  next();
};

// CHECK IF USER IS LOGGED IN
Validate.isLoggedIn = (req, res, next) => {
  if (req.user) return res.redirect('/auth/dashboard');
  next();
};

module.exports = Validate;
