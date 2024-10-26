import { hashPassword } from '@/lib/utils.server';
import { verifySchema } from '@/schemas/auth';
import type { ContextVariables } from '@/server/types';
import { lucia } from '@/services/auth';
import { emailVerificationCodes, users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { isWithinExpirationDate } from 'oslo';

export const verify = new OpenAPIHono<{
    Variables: ContextVariables;
}>().openapi(
    createRoute({
        method: 'post',
        path: '/api/auth/register/verify',
        tags: ['Auth'],
        summary: 'Verifies the confirmation code and stores the password hash.',
        request: {
            body: {
                description: 'Request body',
                content: {
                    'application/json': {
                        schema: verifySchema.openapi('Verify', {
                            example: {
                                email: 'hey@example.com',
                                confirmationCode: '42424242',
                                password: '11eeb60bbef14eb5b8990c02cdb11851',
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
        const { email, confirmationCode, password } = c.req.valid('json');
        const db = c.get('db');

        const normalizedEmail = email.toUpperCase();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.normalizedEmail, normalizedEmail),
            with: {
                emailVerificationCodes: true,
            },
        });

        const error = new HTTPException(400, {
            message:
                'Either the user does not exist, the email is already verified or there is no existing user secret.',
        });

        if (
            !existingUser ||
            existingUser.emailVerified ||
            existingUser.emailVerificationCodes.length <= 0
        ) {
            throw error;
        }

        const code = existingUser.emailVerificationCodes.at(0)!;
        if (!isWithinExpirationDate(code.expiresAt) || code.code !== confirmationCode) {
            throw error;
        }

        const hashedPassword = await hashPassword(password);
        await db.transaction(async ctx => {
            await ctx
                .update(users)
                .set({
                    emailVerified: true,
                    hashedPassword,
                })
                .where(eq(users.id, existingUser.id));

            await ctx.delete(emailVerificationCodes).where(eq(emailVerificationCodes.id, code.id));
        });

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        setCookie(c, sessionCookie.name, sessionCookie.value, {
            ...sessionCookie.attributes,
            sameSite: 'Strict',
        });

        return c.body(null);
    }
);
