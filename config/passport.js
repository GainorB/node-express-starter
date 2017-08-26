// PASSPORT STRATEGIES
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

// JWT
let opts = {};

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
                name: profile.name.givenName + ' ' + profile.name.familyName
              };

              // CREATE A NEW USER USING USER MODEL
              User.create(NewUser).then(user => {
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

              // CREATE A NEW USER USING USER MODEL
              User.create(NewUser).then(user => {
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
                name: profile.name.givenName + ' ' + profile.name.familyName
              };

              // CREATE A NEW USER USING USER MODEL
              User.create(NewUser).then(user => {
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
