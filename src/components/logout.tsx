import { Button } from '@/components/ui/button';
import { logout } from '@/server/actions';

export function Logout() {
    return (
        <form action={logout}>
            <Button>Logout</Button>
        </form>
    );
}
