// index.js
const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');

console.log('Starting server...');

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('GET / request received');
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
