'use server';

import { Routes } from '@/lib/routes';
import { lucia } from '@/services/auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value;

    if (!sessionId) {
        return redirect(Routes.home());
    }

    await lucia.invalidateSession(sessionId);
    (await cookies()).set(lucia.sessionCookieName, '', {
        expires: new Date(0),
        sameSite: 'strict',
    });
    revalidatePath('/');
    return redirect(Routes.home());
}
