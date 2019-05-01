var express = require('express');
var router = express.Router();
var security = require('../services/security.js');

/* GET manager home page. */
router.get('/', function(req, res, next) {
  security.access(req, res, "ROLE_REFEREE");
  res.render('referee');
});

module.exports = router;
