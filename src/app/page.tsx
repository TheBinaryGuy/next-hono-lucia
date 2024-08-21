import { ClientUser } from '@/app/client-user';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Routes } from '@/lib/routes';
import { getUser } from '@/lib/utils.server';
import { logout } from '@/server/actions';
import Link from 'next/link';

export default async function Page() {
    const user = await getUser();
    if (!user) {
        return (
            <div className='container flex h-full flex-col items-center justify-center gap-4'>
                <h1 className='text-4xl font-semibold'>Hono x Lucia</h1>
                <ThemeToggle />
                <div className='flex items-center gap-4'>
                    <Button asChild className='w-28'>
                        <Link href={Routes.login()}>Login</Link>
                    </Button>
                    <Button asChild className='w-28' variant='outline'>
                        <Link href={Routes.getStarted()}>Get Started</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider user={user}>
            <div className='container flex h-full flex-col items-center justify-center gap-4'>
                <h1 className='text-4xl font-semibold'>Hono x Lucia</h1>
                <ThemeToggle />
                <ClientUser />
                <form action={logout}>
                    <Button>Logout</Button>
                </form>
            </div>
        </AuthProvider>
    );
}
