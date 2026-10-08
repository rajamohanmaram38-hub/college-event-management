import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDatabase, execScript, DB_PATH } from './dbConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Initializing College Event Management Database...');
console.log(`📁 Database Path: ${DB_PATH}`);

try {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  console.log('🛠️  Executing schema.sql...');
  execScript(schemaSql);
  console.log('✅ Schema tables and indexes created successfully.');

  console.log('🌱 Executing seed.sql...');
  execScript(seedSql);
  console.log('✅ Seed data inserted successfully.');

  const db = getDatabase();
  const studentsCount = db.prepare('SELECT COUNT(*) as c FROM students').get().c;
  const eventsCount = db.prepare('SELECT COUNT(*) as c FROM events').get().c;
  const registrationsCount = db.prepare('SELECT COUNT(*) as c FROM registrations').get().c;

  console.log('📊 Verification Summary:');
  console.log(`   - Students: ${studentsCount}`);
  console.log(`   - Events: ${eventsCount}`);
  console.log(`   - Registrations: ${registrationsCount}`);
  console.log('🎉 Database initialization complete!');
} catch (error) {
  console.error('❌ Error during database initialization:', error);
  process.exit(1);
}
