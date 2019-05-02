var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
var mysql = require('mysql');
var connection = db.getConnection();

/* CREATE half time event */
router.post('/halfTime/:id', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var now = new Date();

  var timeSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(timeSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var startTime = match.startTime;

    var diffMs = (now - startTime);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    var createSql = 'INSERT INTO matchEvents (teamid, playerid, event, minutes, matchid) VALUES (' + mysql.escape(null) + ', ' + mysql.escape(null) + ', ' + mysql.escape("Half-time") + ', ' + mysql.escape(diffMins) + ', ' + mysql.escape(req.params.id) + ')';
    connection.query(createSql, function (err, result) {
      if (err){ return console.log(err); }
      res.redirect('/referee/' + req.params.id);
    });
  });
});


/* CREATE full time event */
router.post('/fullTime/:id', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var now = new Date();

  var timeSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(timeSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var startTime = match.startTime;

    var diffMs = (now - startTime);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    var createSql = 'INSERT INTO matchEvents (teamid, playerid, event, minutes, matchid) VALUES (' + mysql.escape(null) + ', ' + mysql.escape(null) + ', ' + mysql.escape("Full-time") + ', ' + mysql.escape(diffMins) + ', ' + mysql.escape(req.params.id) + ')';
    connection.query(createSql, function (err, result) {
      if (err){ return console.log(err); }
      res.redirect('/referee/' + req.params.id);
    });
  });
});

/* CREATE yellow card event */
router.post('/referee/:id/yellow-card/:playerid', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var now = new Date();

  var timeSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(timeSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var startTime = match.startTime;

    var diffMs = (now - startTime);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    var getTeamSql = 'SELECT teamSheetId from teamSheetPlayers WHERE id = ' + mysql.escape(req.params.playerid);

    connection.query(getTeamSql, function (err, rows, fields) {
      if (err){ return console.log(err); }

      var createSql = 'INSERT INTO matchEvents (teamid, playerid, event, minutes, matchid) VALUES (' + mysql.escape(rows[0].teamSheetId) + ', ' + mysql.escape(req.params.playerid) + ', ' + mysql.escape("Yellow Card") + ', ' + mysql.escape(diffMins) + ', ' + mysql.escape(req.params.id) + ')';
      connection.query(createSql, function (err, rows, fields) {
        if (err){ return console.log(err); }
        res.redirect('/referee/' + req.params.id);
      });
    });
  });
});


/* CREATE red card event */
router.post('/referee/:id/red-card/:playerid', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var now = new Date();

  var timeSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(timeSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var startTime = match.startTime;

    var diffMs = (now - startTime);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    var getTeamSql = 'SELECT teamSheetId from teamSheetPlayers WHERE id = ' + mysql.escape(req.params.playerid);

    connection.query(getTeamSql, function (err, rows, fields) {
      if (err){ return console.log(err); }

      var createSql = 'INSERT INTO matchEvents (teamid, playerid, event, minutes, matchid) VALUES (' + mysql.escape(rows[0].teamSheetId) + ', ' + mysql.escape(req.params.playerid) + ', ' + mysql.escape("Red Card") + ', ' + mysql.escape(diffMins) + ', ' + mysql.escape(req.params.id) + ')';
      connection.query(createSql, function (err, rows, fields) {
        if (err){ return console.log(err); }
        res.redirect('/referee/' + req.params.id);
      });
    });
  });
});


/* CREATE goal event */
router.post('/referee/:id/goal/:playerid', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  var now = new Date();

  var timeSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(timeSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var startTime = match.startTime;

    var diffMs = (now - startTime);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    var getTeamSql = 'SELECT teamSheetId from teamSheetPlayers WHERE id = ' + mysql.escape(req.params.playerid);

    connection.query(getTeamSql, function (err, rows, fields) {
      if (err){ return console.log(err); }

      var createSql = 'INSERT INTO matchEvents (teamid, playerid, event, minutes, matchid) VALUES (' + mysql.escape(rows[0].teamSheetId) + ', ' + mysql.escape(req.params.playerid) + ', ' + mysql.escape("Goal") + ', ' + mysql.escape(diffMins) + ', ' + mysql.escape(req.params.id) + ')';
      connection.query(createSql, function (err, rows, fields) {
        if (err){ return console.log(err); }
        res.redirect('/referee/' + req.params.id);
      });
    });
  });
});



module.exports = router;
