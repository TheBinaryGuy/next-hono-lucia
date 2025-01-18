import { generateEmailVerificationCode, sendVerificationCode } from '@/lib/utils.server';
import { sendResetCodeSchema } from '@/schemas/auth';
import type { ContextVariables } from '@/server/types';
import { users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export const sendResetCode = new OpenAPIHono<{
    Variables: ContextVariables;
}>().openapi(
    createRoute({
        method: 'post',
        path: '/api/auth/forgot-password/send-reset-code',
        tags: ['Auth'],
        summary: 'Emails the user a temporary password reset code',
        request: {
            body: {
                description: 'Request body',
                content: {
                    'application/json': {
                        schema: sendResetCodeSchema.openapi('SendResetCode', {
                            example: {
                                email: 'hey@example.com',
                            },
                        }),
                    },
                },
                required: true,
            },
        },
        responses: {
            200: {
                description: 'Success',
            },
        },
    }),
    async c => {
        const { email } = c.req.valid('json');
        const db = c.get('db');

        const normalizedEmail = email.toUpperCase();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.normalizedEmail, normalizedEmail),
        });

        // Return success even if user doesn't exist to prevent email enumeration
        if (!existingUser || !existingUser.emailVerified) {
            return c.body(null);
        }

        const code = await generateEmailVerificationCode(existingUser.id);
        const success = await sendVerificationCode(email, code);

        if (!success) {
            throw new HTTPException(500, {
                message: 'Failed to send email.',
            });
        }

        return c.body(null);
    }
);
