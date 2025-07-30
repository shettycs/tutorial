const { Pool } = require('pg');
const dotenv = require('dotenv');
const { parse } = require('pg-connection-string');

dotenv.config();

const config = parse(process.env.DBConnLink);

const pool = new Pool({
  ...config,
  ssl: {
    rejectUnauthorized: false // ✅ needed for Render
  }
});

// Test the connection
pool.connect()
  .then(client => {
    console.log('✅ Database connection successful!');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.stack);
  });

module.exports = pool;