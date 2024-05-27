// db.js
const mysql = require('mysql');

console.log('Setting up database connection...');

const connection = mysql.createConnection({
  host: 'codeplaydb.cjkckcom86z1.eu-north-1.rds.amazonaws.com',
  user: 'Teddayz',      // Your RDS username
  password: 'Teddybearop1!',  // Your RDS password
  database: 'codeplaydb',  // Your RDS database name
  port: 3306                  // Default MySQL port
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the AWS RDS database.');
});

module.exports = connection;
