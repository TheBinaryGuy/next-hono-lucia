import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/utils.server';
import { logout } from '@/server/actions';

export default async function Page() {
    const user = await getUser();
    if (!user) {
        return (
            <div className='container flex h-full flex-col items-center justify-center gap-2'>
                <h1 className='text-4xl font-semibold'>Hono x Lucia</h1>
                <ThemeToggle />
            </div>
        );
    }

    return (
        <div className='container flex h-full flex-col items-center justify-center gap-4'>
            <h1 className='text-4xl font-semibold'>Hono x Lucia</h1>
            <ThemeToggle />
            <form action={logout}>
                <Button>Logout</Button>
            </form>
        </div>
    );
}
