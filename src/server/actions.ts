'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Routes } from '@/lib/routes';
import { lucia } from '@/services/auth';

export async function logout() {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;

    if (!sessionId) {
        return redirect(Routes.home());
    }

    await lucia.invalidateSession(sessionId);
    cookies().set(lucia.sessionCookieName, '', { expires: new Date(0), sameSite: 'strict' });
    revalidatePath('/');
    return redirect(Routes.home());
}
