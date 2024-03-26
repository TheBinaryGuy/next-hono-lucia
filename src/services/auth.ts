import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';

import { serverEnvs } from '@/env/server';
import { db } from '@/services/db';
import { sessions, users } from '@/services/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: serverEnvs.NODE_ENV === 'production',
        },
    },
    getUserAttributes: attributes => {
        return {
            id: attributes.id,
            email: attributes.email,
        };
    },
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            id: number;
            email: string;
        };
    }
}
