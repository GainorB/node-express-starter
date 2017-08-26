// =============================================================
// IMPORTS

require('dotenv').config(); // SUPPORT .ENV FILES
const express = require('express');
const app = express(); // INITILIZE APP
const path = require('path');
const bodyParser = require('body-parser');

const http = require('http'); // USED TO CREATE THE HTTP SERVER
const server = http.createServer(app); // CREATE HTTP SERVER USING APP
const port = process.env.PORT || '3000'; // INITIALIZE DEFAULT PORT OR PORT FROM ENVIRONMENT VARIABLE

const logger = require('morgan'); // TERMINAL LOGGER
const session = require('express-session'); // HANDLE SESSIONS
const passport = require('passport'); // HANDLE AUTH
const flash = require('connect-flash'); // FLASH MESSAGES
const mongoose = require('mongoose');

// =============================================================
// ESTABLISH CONNECTION WITH MONGO

// mongoose.Promise = global.Promise;

// const db = mongoose.connection;

// if (process.env.NODE_ENV !== 'test') {
//   mongoose.connect('mongodb://localhost/emotrr', {
//     useMongoClient: true
//   });

//   db.on('error', err => console.warn('Warning', err));
//   db.once('open', () => console.log('Connected to MongoDB!'));
// }

// =============================================================
// ROUTES

const auth = require('./routes/authRoutes');

// =============================================================
// VIEW ENGINE SETUP

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =============================================================
// EXPRESS FLASH MIDDLEWARE

app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// =============================================================
// POSTGRESQL SESSION STORE

app.use(
  session({
    store: new (require('connect-pg-simple')(session))(),
    secret: process.env.SECRET_KEY,
    resave: true, // changed from false
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
  })
);

// =============================================================
// MIDDLEWARE

app.use(logger('dev')); // USE MORGAN
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// =============================================================
// CORS

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// =============================================================
// SECURITY

app.disable('x-powered-by');

// =============================================================
// USE ROUTES

auth(app);

// =============================================================
// START SERVER

// SET THE PORT
app.set('port', port);

// LISTEN ON SPECIFIED PORT
server.listen(port);

// LOG WHICH PORT THE SERVER IS RUNNING ON
console.log('Server listening on port ' + port);

// =============================================================
// ERROR HANDLER

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// =============================================================
// EXPORT APP

module.exports = app;
