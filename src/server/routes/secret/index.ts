import { OpenAPIHono } from '@hono/zod-openapi';

import { secret } from '@/server/routes/secret/secret';
import { ContextVariables } from '@/server/types';

export const secretApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .use(async (c, next) => {
        const user = c.get('user');
        if (!user) {
            c.status(401);
            return c.body(null);
        }

        return next();
    })
    .route('/', secret);
