var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
var managerTeam = require('./managerTeamEntity');
var mysql = require('mysql');
var connection = db.getConnection();

/* CREATE new teamsheet */
router.post('/createTeamSheet', function(req, res, next) {
  security.access(req, res, "ROLE_MANAGER");

  var createSql = 'INSERT INTO activeTeamSheet (managerid, teamName) VALUES (' + mysql.escape(req.user.id) + ', ' + mysql.escape(req.body.teamName) + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
    else{
      addPlayersToSheet(req.body['playerArray[]'], result.insertId);
    }
  });
  res.redirect('/');
});


/* ADD new players to teamsheet */
function addPlayersToSheet(players, teamsheetid) {
  players = JSON.parse(players);

  var number = 1;

  players.forEach(function(player) {
    var createSql = 'INSERT INTO teamSheetPlayers (playerName, teamSheetId, playerNumber) VALUES (' + mysql.escape(player) + ', ' + mysql.escape(teamsheetid) + ', ' + mysql.escape(number) + ')';
    connection.query(createSql, function (err, result) {
      if (err){ return console.log(err) }
    });
    number++;
  });
}


module.exports = router;
