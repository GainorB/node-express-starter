// PASSPORT STRATEGIES
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = passport => {
  // WHEN YOU LOG IN, INITIALIZE SESSION
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // WHEN YOU LOG OUT, CLEAR SESSION
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // JWT
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = process.env.SECRET_KEY;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  // LOCAL LOGIN
  passport.use(
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        User.findByUserName(username)
          .then(user => {
            if (!user) {
              req.flash('error', 'User not found');
              return done(null, false);
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                // CREATE A TOKEN
                user.jwttoken = '';
                const token = jwt.sign(user, process.env.SECRET_KEY, {
                  expiresIn: 604800 // 1 WEEK
                });

                // STORE TOKEN WHEN REGISTERING IN
                User.storeJWToken(token, user.id);
                return done(null, user);
              } else {
                req.flash('error', 'Password is incorrect');
                return done(null, false);
              }
            });
          })
          .catch(err => {
            req.flash('error', 'Authentication failed');
            return done(err);
          });
      }
    )
  );

  // FACEBOOK LOGIN
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: process.env.FB_CALLBACK,
        profileFields: [
          'id',
          'emails',
          'name',
          'displayName',
          'gender',
          'profileUrl'
        ],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(function() {
          User.findById(profile.id, (err, existingUser) => {
            if (err) return done(err);

            // IF ACCOUNT ALREADY EXISTS
            if (existingUser) {
              existingUser.jwttoken = '';
              const jtoken = jwt.sign(existingUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });

              User.storeJWToken(jtoken, existingUser.id);

              req.flash(
                'info',
                'Facebook account already linked, automatically logged in with facebook.'
              );
              return done(null, existingUser);
            } else {
              // CREATE AN OBJECT WITH NEW USERS PROFILE INFORMATION TAKEN FROM FACEBOOK
              const NewUser = {
                id: profile.id,
                token: accessToken,
                email: profile.emails[0].value,
                name: `${profile.name.givenName} ${profile.name.familyName}`
              };

              const jtoken = jwt.sign(NewUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });
              // CREATE A NEW USER USING USER MODEL
              User.createOAuthUser(NewUser, jtoken).then(user => {
                req.flash('success', 'Facebook account linked.');
                // RETURNS THE NEW USER THAT WAS CREATED
                return done(null, user);
              });
            }
          });
        });
      }
    )
  );

  // TWITTER LOGIN
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TW_CONSUMER_KEY,
        consumerSecret: process.env.TW_CONSUMER_SECRET,
        callbackURL: process.env.TW_CALLBACK,
        includeEmail: true,
        passReqToCallback: true
      },
      (req, token, tokenSecret, profile, done) => {
        process.nextTick(function() {
          User.findById(profile.id, (err, existingUser) => {
            if (err) return done(err);

            // IF ACCOUNT ALREADY EXISTS
            if (existingUser) {
              existingUser.jwttoken = '';
              const jtoken = jwt.sign(existingUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });

              User.storeJWToken(jtoken, existingUser.id);

              req.flash(
                'info',
                'Twitter account already linked, automatically logged in with twitter.'
              );
              return done(null, existingUser);
            } else {
              // CREATE AN OBJECT WITH NEW USERS PROFILE INFORMATION TAKEN FROM TWITTER
              const NewUser = {
                id: profile.id,
                token: token,
                email: profile.emails[0].value,
                name: profile.username
              };

              // CREATE A TOKEN
              const jtoken = jwt.sign(NewUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });

              // CREATE A NEW USER USING USER MODEL
              User.createOAuthUser(NewUser, jtoken).then(user => {
                req.flash('success', 'Twitter account linked.');
                // RETURNS THE NEW USER THAT WAS CREATED
                return done(null, user);
              });
            }
          });
        });
      }
    )
  );

  // GOOGLE LOGIN
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        callbackURL: process.env.G_CALLBACK,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, cb) => {
        process.nextTick(function() {
          User.findById(profile.id, (err, existingUser) => {
            if (err) return cb(err);

            // IF ACCOUNT ALREADY EXISTS
            if (existingUser) {
              existingUser.jwttoken = '';
              const jtoken = jwt.sign(existingUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });

              User.storeJWToken(jtoken, existingUser.id);

              req.flash(
                'info',
                'Google account already linked, automatically logged in with google.'
              );
              return cb(null, existingUser);
            } else {
              // CREATE AN OBJECT WITH NEW USERS PROFILE INFORMATION TAKEN FROM GOOGLE
              const NewUser = {
                id: profile.id,
                token: accessToken,
                email: profile.emails[0].value,
                name: `${profile.name.givenName} ${profile.name.familyName}`
              };

              // CREATE A TOKEN
              const jtoken = jwt.sign(NewUser, process.env.SECRET_KEY, {
                expiresIn: 604800 // 1 WEEK
              });

              // CREATE A NEW USER USING USER MODEL
              User.createOAuthUser(NewUser, jtoken).then(user => {
                req.flash('success', 'Google account linked.');
                // RETURNS THE NEW USER THAT WAS CREATED
                return cb(null, user);
              });
            }
          });
        });
      }
    )
  );
};
