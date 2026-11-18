const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // render necesita ssl, en local se pone DB_SSL=false
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

module.exports = pool;