var express = require('express');
var router = express.Router();
var auth = require('../../auth.js');

/* Redirect to correct page. */
router.get('/successRedirect', function(req, res, next) {
  if(req.user.role === "ROLE_MANAGER") {
    res.redirect('/manager');
  } else if (req.user.role === "ROLE_ADMIN") {
    res.redirect('/admin');
  } else if (req.user.role === "ROLE_REFEREE") {
    res.redirect('/referee');
  } else {
    res.redirect('/');
  }
});

/* Logout function. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/login', auth.authenticate('login', {
    successRedirect: '/successRedirect',
    failureRedirect: '/',
    failureFlash: true
}));

module.exports = router;
