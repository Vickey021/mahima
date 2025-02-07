const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Set up PostgreSQL client
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
  });

  try {
    // Connect to PostgreSQL
    await client.connect();

    // Query to validate user credentials
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = crypt($2, password)',
      [username, password]
    );

    if (result.rows.length > 0) {
      // Valid login
      res.status(200).json({ success: true });
    } else {
      // Invalid login
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await client.end();
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
