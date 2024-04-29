'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute='class'>
                {children}
                <ReactQueryDevtools />
                <Toaster richColors />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
