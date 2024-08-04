import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { getCookie, setCookie } from 'hono/cookie';

import { authApp } from '@/server/routes/auth';
import { secretApp } from '@/server/routes/secret';
import type { ContextVariables } from '@/server/types';
import { lucia } from '@/services/auth';
import { db } from '@/services/db';

const app = new OpenAPIHono<{ Variables: ContextVariables }>();

app.use(async (c, next) => {
    c.set('db', db);

    const sessionId = getCookie(c, lucia.sessionCookieName);

    if (!sessionId) {
        c.set('user', null);
        c.set('session', null);
        return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        setCookie(c, lucia.sessionCookieName, sessionCookie.serialize(), {
            ...sessionCookie.attributes,
            sameSite: 'Strict',
        });
    }

    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        setCookie(c, lucia.sessionCookieName, sessionCookie.serialize(), {
            ...sessionCookie.attributes,
            sameSite: 'Strict',
        });
    }

    c.set('user', user);
    c.set('session', session);
    return next();
});

app.doc31('/api/swagger.json', {
    openapi: '3.1.0',
    info: { title: 'Hono x Lucia', version: '1.0.0' },
});

app.get(
    '/api/scalar',
    apiReference({
        spec: {
            url: '/api/swagger.json',
        },
    })
);

const routes = app.route('/', authApp).route('/', secretApp);

export type AppType = typeof routes;

export { app };
