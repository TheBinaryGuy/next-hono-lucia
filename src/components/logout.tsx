import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';

export function Logout() {
    return (
        <form action={logout}>
            <Button>Logout</Button>
        </form>
    );
}
