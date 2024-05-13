import { type Config } from 'drizzle-kit';

import { serverEnvs } from '@/env/server';

export default {
    schema: './src/services/db/schema.ts',
    out: './src/services/db',
    dialect: 'postgresql',
    dbCredentials: {
        url: serverEnvs.DATABASE_URL,
    },
} satisfies Config;
