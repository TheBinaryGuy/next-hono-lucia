import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import { serverEnvs } from '@/env/server';
import * as schema from '@/services/db/schema';

const client = new Client({ connectionString: serverEnvs.DATABASE_URL });
await client.connect();

export const db = drizzle(client, { schema });
