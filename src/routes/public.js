var express = require('express');
var router = express.Router();
var db = require('../db.js');
var security = require('../services/security.js');
var teamSheet = require('../entities/teamSheetEntity.js');
var connection = db.getConnection();
var mysql = require('mysql');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('public', { req: req });
});

/* GET spectate page. */
router.get('/spectate', function(req, res, next) {

  var matchesSql = 'SELECT * from matches';
  var teamsSql = 'SELECT * from activeTeamSheet';

  connection.query(matchesSql, function (err, rows, fields) {
    if (err) throw err;
    var matches = rows;
    console.log(matches);

    connection.query(teamsSql, function (err, rows, fields) {
      if (err) throw err;
      var teams = rows;
      console.log(teams);

      res.render('spectate', { req: req, teams: teams, matches: matches });
    });
  });
});

/* GET spectate page. */
router.get('/spectate/:id', function(req, res, next) {
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

        var teamOneGoals = 'SELECT count(*) as total FROM matchEvents WHERE event = "Goal" and teamid = '  + mysql.escape(teamOneData.id);
        var teamTwoGoals = 'SELECT count(*) as total FROM matchEvents WHERE event = "Goal" and teamid = ' +  mysql.escape(teamTwoData.id);

        connection.query(teamOneGoals, function(err, result) {
          var teamOneGoalNum = result[0].total;

          connection.query(teamTwoGoals, function(err, result) {
            var teamTwoGoalNum = result[0].total;

            connection.query(liveUpdates, function (err, rows, fields) {
              if (err) throw err;

              res.render('spectate-match', { teamOneData: teamOneData, teamTwoData: teamTwoData, time: match.startTime.toLocaleTimeString(), matchid: req.params.id, updates: rows.reverse(), teamOneGoals: teamOneGoalNum, teamTwoGoals: teamTwoGoalNum });
            });
          });
        });
      });
    });
  });
});


module.exports = router;
