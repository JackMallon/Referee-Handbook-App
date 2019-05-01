var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sports_app'
});

connection.connect(function(err) {
  if (err) throw err;
});

function getConnection(){
  return connection;
}

module.exports.getConnection = getConnection;
