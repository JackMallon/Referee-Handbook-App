var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
var mysql = require('mysql');
var connection = db.getConnection();

/* CREATE new team */
router.post('/createMatch', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var Time = new Date();

  var createSql = 'INSERT INTO matches (teamIdOne, teamIdTwo, startTime) VALUES (' + mysql.escape(req.body.team1) + ', ' + mysql.escape(req.body.team2) + ', ' + mysql.escape(Time) + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
    res.send('/referee/' + result.insertId);
  });
});

module.exports = router;
