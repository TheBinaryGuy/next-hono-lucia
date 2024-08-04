import { Routes } from '@/lib/routes';
import type { ContextVariables } from '@/server/types';
import { lucia } from '@/services/auth';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { getCookie, setCookie } from 'hono/cookie';

export const logout = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'get',
        path: '/api/auth/logout',
        tags: ['Auth'],
        summary: 'Logout',
        responses: {
            200: {
                description: 'Success',
            },
        },
    }),
    async c => {
        const sessionId = getCookie(c, lucia.sessionCookieName);

        if (!sessionId) {
            return c.redirect(Routes.login());
        }

        await lucia.invalidateSession(sessionId);
        setCookie(c, lucia.sessionCookieName, '', { expires: new Date(0), sameSite: 'Strict' });
        return c.redirect(Routes.home());
    }
);
