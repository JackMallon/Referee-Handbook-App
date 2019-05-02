var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
  var mysql = require('mysql');
var connection = db.getConnection();


/* CREATE new manager */
router.post('/createManager', function(req, res, next) {
  security.access(req, res, "ROLE_ADMIN");

  var createSql = 'INSERT INTO users (username, password, role) VALUES (' + mysql.escape(req.body.username) + ', ' + mysql.escape(req.body.password) + ', ' + mysql.escape("ROLE_MANAGER") + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
  });
  res.redirect('/admin');
});


/* CREATE new referee */
router.post('/createReferee', function(req, res, next) {
  security.access(req, res, "ROLE_ADMIN");

  var createSql = 'INSERT INTO users (username, password, role) VALUES (' + mysql.escape(req.body.username) + ', ' + mysql.escape(req.body.password) + ', ' + mysql.escape("ROLE_REFEREE") + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
  });
  res.redirect('/admin');
});


/* CREATE new admin */
router.post('/createAdmin', function(req, res, next) {
  security.access(req, res, "ROLE_ADMIN");

  var createSql = 'INSERT INTO users (username, password, role) VALUES (' + mysql.escape(req.body.username) + ', ' + mysql.escape(req.body.password) + ', ' + mysql.escape("ROLE_ADMIN") + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
  });
  res.redirect('/admin');
});


module.exports = router;
