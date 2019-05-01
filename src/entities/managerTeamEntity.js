var express = require('express');
var router = express.Router();
var security = require('../services/security.js');
var db = require('../db.js');
var mysql = require('mysql');
var connection = db.getConnection();

/* CREATE new managerTeam */
function createManagerTeam(teamid, managerid) {
  var createSql = 'INSERT INTO managerTeam (teamid, managerid) VALUES (' + mysql.escape(teamid) + ', ' + mysql.escape(managerid) + ')';
  connection.query(createSql, function (err, result) {
    if (err){
      return console.log(err);
    }
    else{
      console.log("SUCCESS");
    }
  });
}

module.exports.createManagerTeam = createManagerTeam;
