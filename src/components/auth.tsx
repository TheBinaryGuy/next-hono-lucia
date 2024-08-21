'use client';

import type { User } from 'lucia';
import { createContext, type ReactNode, useContext } from 'react';

export interface AuthContextValue {
    user: User;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export function AuthProvider({ children, user }: { children: ReactNode; user: User }) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
