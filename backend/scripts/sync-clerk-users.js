import { createClerkClient } from '@clerk/express';
import { upsertUser } from '../src/db.js';

const secretKey = process.env.CLERK_SECRET_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!secretKey) throw new Error('CLERK_SECRET_KEY is not defined. Add it to backend/.env');
if (!databaseUrl) throw new Error('DATABASE_URL is not defined. Add it to backend/.env');

const clerk = createClerkClient({ secretKey });

let synced = 0;
let failed = 0;
let offset = 0;
const limit = 100;
const maxUsers = 10000;

while (offset < maxUsers) {
  const response = await clerk.users.getUserList({ limit, offset });
  const users = response.data ?? [];
  if (users.length === 0) break;

  for (const user of users) {
    try {
      await upsertUser({
        id: user.id,
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress ?? null,
      });
      synced += 1;
    } catch (error) {
      failed += 1;
      console.error(`Failed to sync user ${user.id}:`, error.message);
    }
  }

  if (users.length < limit) break;
  offset += limit;
}

console.log(`Sync complete. Synced ${synced} user(s), failed ${failed}.`);
