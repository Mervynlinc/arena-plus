import { neon } from '@neondatabase/serverless';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Add it to backend/.env');
}

const sql = neon(databaseUrl);
const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

for (const file of files) {
  const content = (await readFile(join(migrationsDir, file), 'utf8')).trim();
  if (!content) continue;
  await sql.query(content);
  console.log(`Applied ${file}`);
}

console.log('Migrations complete');
