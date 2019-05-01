var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
var managerTeam = require('./managerTeamEntity');
var mysql = require('mysql');
var connection = db.getConnection();

/* CREATE new team */
function createNewTeam(teamName, managerid) {
  var createSql = 'INSERT INTO teams (teamName) VALUES (' + mysql.escape(teamName) + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
    else{
      managerTeam.createManagerTeam(result.insertId, managerid);
    }
  });
}

module.exports.createNewTeam = createNewTeam;
