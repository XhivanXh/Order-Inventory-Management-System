const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.log('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release();
});

module.exports = db;
