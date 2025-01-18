import { db } from '@/services/db';
import { users } from '@/services/db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(googleId: string, email: string, name: string, picture: string) {
    const newUser = (
        await db
            .insert(users)
            .values({
                googleId,
                email: email.toUpperCase(),
                name,
                picture,
                normalizedEmail: email,
                emailVerified: true,
            })
            .returning({
                id: users.id,
                googleId: users.googleId,
                email: users.email,
                name: users.name,
            })
    ).at(0);
    if (!newUser) {
        throw new Error('Unexpected error');
    }
    return newUser;
}

export async function getUserFromGoogleId(googleId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.googleId, googleId),
        columns: {
            id: true,
            googleId: true,
            email: true,
            name: true,
            picture: true,
        },
    });
    if (!user) {
        return null;
    }
    return user;
}
