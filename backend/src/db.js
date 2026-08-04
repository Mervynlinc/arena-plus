import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Add it to backend/.env');
}

const sql = neon(databaseUrl);

export async function getStoredUser(userId) {
  const rows = await sql`
    SELECT id, username, email, created_at, updated_at
    FROM users
    WHERE id = ${userId}
  `;
  return rows[0] ?? null;
}

export async function upsertUser({ id, username, email }) {
  const rows = await sql`
    INSERT INTO users (id, username, email)
    VALUES (${id}, ${username ?? null}, ${email ?? null})
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      updated_at = now()
    RETURNING id, username, email, created_at, updated_at
  `;
  return rows[0] ?? null;
}

export async function deleteUser(userId) {
  await sql`DELETE FROM users WHERE id = ${userId}`;
}
