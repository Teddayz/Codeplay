// db.js
const mysql = require('mysql');

console.log('Setting up database connection...');

const connection = mysql.createConnection({
  host: 'your-rds-endpoint',  // e.g., mydbinstance.abcdefg12345.us-west-2.rds.amazonaws.com
  user: 'your-username',      // Your RDS username
  password: 'your-password',  // Your RDS password
  database: 'your-database',  // Your RDS database name
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
