import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  // Parse connection string
  const url = new URL(connectionString);
  const config = {
    host: url.hostname,
    port: parseInt(url.port) || 4000,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: {
      rejectUnauthorized: true
    }
  };

  console.log('Connecting to database...');
  const connection = await mysql.createConnection(config);

  try {
    // Drop content_tags first (has FK to content)
    console.log('Dropping content_tags table...');
    try {
      await connection.execute('DROP TABLE IF EXISTS content_tags');
      console.log('✓ Dropped content_tags');
    } catch (error) {
      console.log('Note:', error.message);
    }

    // Read the migration file
    const sql = readFileSync('./recreate-content-tables.sql', 'utf8');
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 50)}...`);
      
      try {
        await connection.execute(statement);
        console.log('✓ Success');
      } catch (error) {
        console.error('✗ Error:', error.message);
        if (!statement.startsWith('DROP TABLE')) {
          throw error; // Only throw on non-DROP errors
        }
      }
    }

    console.log('\n✓ Migration completed successfully!');
  } finally {
    await connection.end();
  }
}

runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
