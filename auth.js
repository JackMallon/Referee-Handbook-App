var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var db = require('./src/db.js');

// Register a login strategy
passport.use('login', new LocalStrategy(function(username, password, done) {
  var passSql = 'SELECT * from users WHERE username = ' + mysql.escape(username);

  var connection = db.getConnection();

  connection.query(passSql, function (err, rows, fields, verPwd) {
    if(rows.length == 1){
      var user = rows[0];
      if(user.password === password){
        return done(null, user);
      }
    }
    done(null, false, { message: 'Invalid username and password.' });
  });

}));

// Required for storing user info into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Required for retrieving user from session
passport.deserializeUser(function(id, done) {
  var connection = db.getConnection();
  var passSql = 'SELECT * from users WHERE id = ' + mysql.escape(id);
  connection.query(passSql, function (err, rows, fields, verPwd) {
    var user = rows[0];
    done(null, user);
  });
});

module.exports = passport;
