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

        res.status(201).json({
          success: true,
          message: 'User registered',
          token: 'JWT ' + token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });

        // STORE TOKEN WHEN REGISTERING IN
        User.storeJWToken(token, user.id);
      })
      .catch(err =>
        res.json({ status: false, msg: 'Error registering user', err })
      );
  },

  dashboard(req, res) {
    res.json({ user: req.user });
  },

  // USER PROVIDES INVALID LOGIN DETAILS
  invalidLogin(req, res) {
    req.flash('error', 'Invalid credentials');
    res.status(401).json({
      status: false,
      message: 'Please try again'
    });
  },

  // LOGOUT
  logOut(req, res) {
    req.flash('info', 'You are now logged out');
    req.logout();
    res.redirect('/');
  }
};
