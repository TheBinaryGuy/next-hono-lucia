import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const clientEnvs = createEnv({
    client: {
        NEXT_PUBLIC_DOMAIN: z.string(),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    },
    emptyStringAsUndefined: true,
});

export type ClientEnvs = typeof clientEnvs;
