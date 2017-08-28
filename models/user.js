const db = require('../config/config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const User = {};

// FIND USER BY USERNAME
User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', userName);
};

// LOCAL LOGIN/REGISTER: STORE JWT TOKEN
User.storeJWToken = (token, userID) => {
  return db.none('UPDATE users SET jwttoken = $1 WHERE id = $2', [
    token,
    userID
  ]);
};

// OAUTH LOGIN/STORE JWTTOKEN
User.createOAuthUser = (user, token) => {
  return db.one(
    `
        INSERT INTO users
        (id, name, email, oauthtoken, jwttoken)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [user.id, user.name, user.email, user.token, token]
  );
};

// FIND USER BY ID
User.findById = (id, callback) => {
  return db
    .oneOrNone('SELECT * FROM users WHERE id = $1', id)
    .then(user => callback(null, user));
};

// GENERATES RANDOM ID
User.randomID = () => {
  return _.random(0, 10000000000, false);
};

// CREATE A LOCAL USER
User.create = async user => {
  let ids;
  let newUser;
  let newRandomID = User.randomID();
  try {
    ids = await db.any('SELECT id FROM users');
    let newIDs = ids.map(e => e.id);
    if (!newIDs.includes(newRandomID)) {
      newUser = await db.one(
        `
            INSERT INTO users
            (id, username, password, email, jwttoken)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
        [newRandomID, user.username, user.password, user.email, user.jwttoken]
      );
    } else {
      console.log(`ID ${newRandomID} is already used!`);
    }
  } catch (err) {
    throw new Error('Error during user registration' + err);
  }
  return newUser;
};

// USE BCRYPT TO ENCRYPT PASSWORD
User.addUser = (newUser, token) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newUser.password, salt);

  return User.create({
    username: newUser.username,
    password: hash,
    email: newUser.email,
    jwttoken: token
  });
};

// COMPARE PASSWORD WHEN LOGGING IN
User.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

// VALIDATE EMAIL USING REGEX
User.validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports = User;
