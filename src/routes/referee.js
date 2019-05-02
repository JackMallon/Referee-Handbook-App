var express = require('express');
var router = express.Router();
var db = require('../db.js');
var security = require('../services/security.js');
var teamSheet = require('../entities/teamSheetEntity.js');
var connection = db.getConnection();
var mysql = require('mysql');


/* GET referee home page. */
router.get('/', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");

  connection.query("SELECT * FROM activeTeamSheet", function (err, data, fields) {
    if (err){
      return console.log(err);
    }
    else{
      res.render('referee', { data: data });
    }
  });
});

/* GET referee match */
router.get('/:id', function (req, res) {
  security.access(req, res, "ROLE_REFEREE");

  var passSql = 'SELECT * from matches WHERE id = ' + mysql.escape(req.params.id);

  connection.query(passSql, function (err, rows, fields) {
    if (err) throw err;

    var match = rows[0];
    var teamOne = match.teamIdOne;
    var teamTwo = match.teamIdTwo;

    var teamOneSql = 'SELECT * from activeTeamSheet WHERE id = ' + mysql.escape(teamOne);
    var teamTwoSql = 'SELECT * from activeTeamSheet WHERE id = ' + mysql.escape(teamTwo);
    var liveUpdates = 'SELECT * from matchEvents WHERE matchid = ' + mysql.escape(req.params.id);
    //var playerNameSql = 'SELECT  from matchEvents WHERE matchid = ' + mysql.escape(req.params.id);

    connection.query(teamOneSql, function (err, rows, fields) {
      if (err) throw err;
      var teamOneData = rows[0];


      connection.query(teamTwoSql, function (err, rows, fields) {
        if (err) throw err;
        var teamTwoData = rows[0];


        connection.query(liveUpdates, function (err, rows, fields) {
          if (err) throw err;


          res.render('referee-match', { teamOneData: teamOneData, teamTwoData: teamTwoData, time: match.startTime.toLocaleTimeString(), matchid: req.params.id, updates: rows.reverse() });
        });
      });
    });
  });
});

/* GET referee yellow card */
router.get('/:id/yellow-card/:teamid', function (req, res) {
  security.access(req, res, "ROLE_REFEREE");

  var playersSql = 'SELECT * from teamSheetPlayers WHERE teamSheetId = ' + mysql.escape(req.params.teamid);

  connection.query(playersSql, function (err, rows, fields) {
    if (err) throw err;

    var players = rows;

    res.render('referee-yellow', { players: players, matchid: req.params.id });
  });
});


/* GET referee red card */
router.get('/:id/red-card/:teamid', function (req, res) {
  security.access(req, res, "ROLE_REFEREE");

  var playersSql = 'SELECT * from teamSheetPlayers WHERE teamSheetId = ' + mysql.escape(req.params.teamid);

  connection.query(playersSql, function (err, rows, fields) {
    if (err) throw err;

    var players = rows;

    res.render('referee-red', { players: players, matchid: req.params.id });
  });
});

/* GET referee goal */
router.get('/:id/goal/:teamid', function (req, res) {
  security.access(req, res, "ROLE_REFEREE");

  var playersSql = 'SELECT * from teamSheetPlayers WHERE teamSheetId = ' + mysql.escape(req.params.teamid);

  connection.query(playersSql, function (err, rows, fields) {
    if (err) throw err;

    var players = rows;

    res.render('referee-goal', { players: players, matchid: req.params.id });
  });
});



module.exports = router;
