import { secret } from '@/server/routes/secret/secret';
import type { ContextVariables } from '@/server/types';
import { OpenAPIHono } from '@hono/zod-openapi';

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
