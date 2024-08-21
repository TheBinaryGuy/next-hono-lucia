'use client';

import { useAuth } from "@/components/auth";

export function ClientUser() {
    const {user} = useAuth();
    return (
        <div>
            Signed in as: {user.email}
        </div>
    );
}
