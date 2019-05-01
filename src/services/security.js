var express = require('express');

function access(req, res, role){
  if(req.user) {
    if(req.user.role === role) {
      return;
    }
  }
  res.redirect('/');
}

module.exports.access = access;
