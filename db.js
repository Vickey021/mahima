const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.ep-soft-mud-a8t682u9.eastus2.azure.neon.tech,
  database: process.env.chemical,
  password: process.env.ae9NZFEBA3gx,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
