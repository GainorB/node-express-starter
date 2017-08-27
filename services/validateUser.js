const User = require('../models/user');

const Validate = {};

Validate.test = (req, res, next) => {
  // EXTRACT FORM DATA
  const { username, email, password } = req.body;

  // CHECK IF USERNAME IS VALID (NOT EMPTY)
  if (!username) {
    return res.status(422).json({
      success: false,
      message: 'Username is required'
    });

    next();
  }

  // CHECK IF PASSWORD IS VALID (NOT EMPTY)
  if (!password) {
    return res.status(422).json({
      success: false,
      message: 'Password is required'
    });

    next();
  }

  // IF THE ROUTE MATCHES THIS, IT MEANS A NEW USER IS TRYING TO REGISTER
  // CHECK IF EMAIL IS PROVIDED THEN CHECK THE FORMAT OF EMAIL
  if (req.route.path === '/auth/register') {
    // CHECK IF EMAIL IS VALID (NOT EMPTY)
    if (!email) {
      return res.status(422).json({
        success: false,
        message: 'Email is required'
      });

      next();
    }

    // CHECK EMAIL IF IT IS FORMATTED CORRECTLY
    if (!User.validateEmail(email)) {
      return res.status(422).json({
        success: false,
        message: 'Please use a valid email'
      });

      next();
    }
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
