import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { serverEnvs } from '@/env/server';
import * as schema from '@/services/db/schema';

declare global {
    // eslint-disable-next-line no-var
    var globalDb: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (serverEnvs.NODE_ENV === 'production') {
    db = drizzle(postgres(serverEnvs.DATABASE_URL, { prepare: true }), { schema });
} else {
    if (!global.globalDb)
        global.globalDb = drizzle(postgres(serverEnvs.DATABASE_URL, { prepare: true }), { schema });

    db = global.globalDb;
}

export { db };
