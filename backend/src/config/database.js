/**
 * Database Connection Configuration
 * CEO and Creator: David Adriano Ferrari dos Santos
 * Davidhub - Real GitHub Clone
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'davidhub_db',
  user: process.env.DB_USER || 'davidhub_user',
  password: process.env.DB_PASSWORD || 'davidhub_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

module.exports = pool;
