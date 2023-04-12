const mysql = require('mysql');
const db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '111111',
    database : 'test2'
  });
  db.connect();

  module.exports = db;