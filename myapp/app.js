var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "secretPassword", resave: true, saveUninitialized: true }));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sys'
});

connection.connect(function(error) {});


//Login post method
app.post('/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  var passSql = 'SELECT password from users WHERE username = ' + mysql.escape(username);

  connection.query(passSql, function (err, rows, fields, verPwd) {
    if (err) throw err
    for(var i=0; i< rows.length; i++){
       var user = rows[i];
       console.log(user.password);
       if(user.password != password){
         res.send("Username or password incorrect!");
       } else {
         returnRole(res, username);
       }
    }
  });
});

//Return Role to JQuery
function returnRole(res, username){
  var roleSql = 'SELECT Role from users WHERE username = ' + mysql.escape(username);
  connection.query(roleSql, function (err, rows, fields) {
    if (err) throw err
    for(var i=0; i< rows.length; i++){
      var user = rows[i];
      res.send(user.Role);
    }
  });
}

//Return Order Data
app.post('/orderData',function(req,res){
  var dataSql = 'SELECT * FROM orders';
  var total = 0;
  connection.query(dataSql, function (err, rows, fields) {
    if (err) throw err
    for(var i=0; i< rows.length; i++){
      var order = rows[i];
      total = total + order.price;
    }
    var data = [total, rows.length];
    res.send(data);
  });
});

//Return Donut Data
app.post('/donutData',function(req,res){
  var dataSql = 'SELECT * FROM donuts';
  var total = 0;
  var data = [0, 0, 0, 0, 0, 0];
  connection.query(dataSql, function (err, rows, fields) {
    if (err) throw err
    for(var i=0; i< rows.length; i++){
      var donut = rows[i];
      data[i] = donut.quantity;
      total = total + donut.quantity;
    }
    data[5] = total;
    res.send(data);
  });
});

//Add Donuts
app.post('/addDonut',function(req,res){
  var donutCode = req.body.donut;

  id = getId(donutCode);

  var sql = 'UPDATE donuts SET Quantity = Quantity + 1 WHERE id = ' + mysql.escape(id);

  connection.query(sql, function (err, rows, fields) { if (err) throw err });
});

//Confirm Basket
app.post('/confirmBasket',function(req,res){

  data = req.session.basket;
  var donutCodes = data.replace('undefined','');
  donutCodes = donutCodes.trim().split(" ");

  for(var i = 0; i < donutCodes.length; i++) {
      var sql = 'INSERT INTO orders (donutId, price) VALUES (' + getId(donutCodes[i]) + ', ' + getPrice(donutCodes[i]) + ')';
      connection.query(sql, function (err, rows, fields) { if (err) throw err });
      console.log("finished!");
  }
});

//Add Donut to Basket
app.post('/addToBasket',function(req,res){
  console.log(req.body.basket);
  req.session.basket = req.session.basket + req.body.basket + " ";
  req.session.totalOfBasket = req.session.totalOfBasket + getPrice(req.body.basket);
  res.end("Done");
});

//Get Basket
app.post('/getSessionData',function(req,res){
  var data = req.session.basket;
  res.send(data);
  res.end("Done");
});


function getId(donutCode) {
  var id = 0;

  switch(donutCode) {
  case "origGlazed":
    id = 1;
    break;
  case "chocSprnk":
    id = 2;
    break;
  case "cookieKreme":
    id = 3;
    break;
  case "chocIced":
    id = 4;
    break;
  case "kreme":
    id = 5;
    break;
  default:
    console.log("DEFAULT");
  }

  return id;
}

function getPrice(donutCode) {
  var id = 0;

  switch(donutCode) {
  case "origGlazed":
    return 4.50;
    break;
  case "chocSprnk":
    return 5.00;
    break;
  case "cookieKreme":
    return 5.50;
    break;
  case "chocIced":
    return 5.00;
    break;
  case "kreme":
    return 5.00;
    break;
  default:
    console.log("DEFAULT");
  }

  return id;
}

//Initialize Cookies
app.post('/initializeCookies',function(req,res){
  req.session.basket = "";
  req.session.totalOfBasket = 0.00;
  res.end("Done");
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
