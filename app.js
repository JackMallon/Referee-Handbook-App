var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./auth.js');
var app = express();

// routes
var indexRouter = require('./src/routes/public');
var managerRouter = require('./src/routes/manager');
var securityRouter = require('./src/routes/security');
var adminRouter = require('./src/routes/admin');
var refereeRouter = require('./src/routes/referee');

// entities
var userEntity = require('./src/entities/userEntity');
var teamSheetEntity = require('./src/entities/teamSheetEntity');
var matchEntity = require('./src/entities/matchEntity');
var matchEventEntity = require('./src/entities/matchEventEntity');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// create session
app.use(session({
    secret: '2019web!secret',
    saveUninitialized: false,
    resave: true
}));

app.use(auth.initialize());
app.use(auth.session());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use my routes
app.use('/', indexRouter);
app.use('/', securityRouter);
app.use('/manager', managerRouter);
app.use('/admin', adminRouter);
app.use('/referee', refereeRouter);

// use my entities
app.use('/', userEntity);
app.use('/', teamSheetEntity);
app.use('/', matchEntity);
app.use('/', matchEventEntity);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
