import type { ContextVariables } from '@/server/types';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

export const secret = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'get',
        path: '/api/secret',
        tags: ['Secret'],
        summary: 'Shhh...',
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: z
                            .object({
                                message: z.string(),
                                email: z.string().email(),
                            })
                            .openapi('SecretResponse'),
                    },
                },
            },
        },
    }),
    async c => {
        const user = c.get('user')!;

        return c.json({
            message: 'Secret Message',
            email: user.email,
        });
    }
);
