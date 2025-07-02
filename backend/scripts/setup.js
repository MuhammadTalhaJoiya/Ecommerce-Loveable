const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Hacker!@#123123',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
    // ❌ Do not specify `database` here because 'ecommerce' may not exist yet
  });

  try {
    console.log('🔧 Setting up database...');
    
    const sqlFile = path.join(__dirname, '..', 'database', 'schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // ✅ Use .query() instead of .execute()
    await connection.promise().query(sql);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Sample data has been inserted.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    connection.end();
  }
}

setupDatabase();
