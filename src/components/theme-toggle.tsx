'use client';

import { useSyncExternalStore } from 'react';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
    const useThemeProps = useTheme();

    // https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store
    const themeValue = useSyncExternalStore(
        emptySubscribe,
        () => useThemeProps,
        () => null
    );

    if (!themeValue) {
        return (
            <Button variant='ghost' size='sm' className='w-9 px-0'>
                <MoonIcon className='size-5' />
            </Button>
        );
    }

    const { theme, setTheme } = themeValue;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='w-9 px-0'>
                    {(theme === 'light' || (theme === 'system' && !systemDark)) && (
                        <SunIcon className='size-5' />
                    )}
                    {(theme === 'dark' || (theme === 'system' && systemDark)) && (
                        <MoonIcon className='size-5' />
                    )}
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    <SunIcon className='mr-2 size-4' />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <MoonIcon className='mr-2 size-4' />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    <LaptopIcon className='mr-2 size-4' />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
