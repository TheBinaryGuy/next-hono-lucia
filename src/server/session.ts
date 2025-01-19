import { db } from '@/services/db';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { sessions } from '@/services/db/schema';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { lucia } from '@/services/auth';

export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const row = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: {
            users: true,
        },
    });

    if (!row) {
        return { session: null, user: null };
    }
    const session = row;
    const user = row?.users;

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessions).where(eq(sessions.id, session.id));
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .update(sessions)
            .set({ expiresAt: session.expiresAt })
            .where(eq(sessions.id, session.id));
    }
    return { session, user };
}

export const getCurrentSession = cache(async () => {
    const token = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = validateSessionToken(token);
    return result;
});

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    (await cookies()).set(lucia.sessionCookieName, token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    (await cookies()).set(lucia.sessionCookieName, '', {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32(tokenBytes).toLowerCase();
    return token;
}

export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: InferInsertModel<typeof sessions> = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await db.insert(sessions).values({
        id: sessionId,
        userId,
        expiresAt: session.expiresAt,
    });
    return session;
}

export interface Session {
    id: string;
    expiresAt: Date;
    userId: number;
}
