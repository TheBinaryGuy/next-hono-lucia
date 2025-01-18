import { clientEnvs } from '@/env/client';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getBaseUrl() {
    if (typeof window !== 'undefined') return window.location.origin;
    if (clientEnvs.NEXT_PUBLIC_DOMAIN.startsWith('localhost'))
        return `http://${clientEnvs.NEXT_PUBLIC_DOMAIN}`;
    return `https://${clientEnvs.NEXT_PUBLIC_DOMAIN}`;
}
export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (err instanceof ZodError) return err.issues[0]?.message ?? err.message;
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object' && 'message' in err) return String(err.message);
    return 'Something went wrong';
}

export function handleFormError(err: Record<string, unknown>) {
    console.log(err);
    if (typeof window === 'undefined') {
        throw new Error('This function can only be used in the browser');
    }

    // Function to find the first message in nested objects and arrays
    function findFirstMessage(value: unknown): string | undefined {
        // Handle arrays
        if (Array.isArray(value)) {
            for (const item of value) {
                const message = findFirstMessage(item);
                if (message) return message;
            }
        }
        // Handle objects
        else if (value && typeof value === 'object') {
            const obj = value as Record<string, unknown>;
            for (const [key, val] of Object.entries(obj)) {
                if (key === 'message' && typeof val === 'string') {
                    return val;
                }
                const nestedMessage = findFirstMessage(val);
                if (nestedMessage) return nestedMessage;
            }
        }
        return undefined;
    }

    // Scroll to the first error field
    const firstErrorKey = Object.keys(err)[0]!;
    document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: 'smooth' });

    // Handle different types of error values
    if (err instanceof ZodError) {
        toast.error(`${capitalizer(firstErrorKey)} - ${err.errors[0]!.message}`);
        return;
    }

    const errorValue = err[firstErrorKey];

    if (typeof errorValue === 'string') {
        toast.error(errorValue);
    } else if (Array.isArray(errorValue) && typeof errorValue[0] === 'string') {
        toast.error(errorValue[0]);
    } else {
        const message = findFirstMessage(err);
        toast.error(message ?? 'Please fill in the required fields correctly.');
    }
}

export function capitalizer(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
