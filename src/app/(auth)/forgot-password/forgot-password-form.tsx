'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { type SendResetCode, sendResetCodeSchema } from '@/schemas/auth';
import { client } from '@/server/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
    const { push } = useRouter();

    const form = useForm<SendResetCode>({
        resolver: zodResolver(sendResetCodeSchema),
        defaultValues: {
            email: '',
        },
    });

    const { mutate, isPending } = useSendResetCode({
        onSuccess: (_, { email }) => {
            push(Routes.resetPassword(undefined, { search: { email } }));
        },
        onError: () => {
            toast.error('Failed to send reset code');
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(values => mutate(values))} className='space-y-4'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormDescription>
                                We will send you a reset code at this email address.
                            </FormDescription>
                            <FormControl>
                                <Input placeholder='hey@example.com' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={isPending}>
                    <Loader2
                        className={cn('mr-2 size-4 animate-spin', {
                            [`inline`]: isPending,
                            [`hidden`]: !isPending,
                        })}
                    />
                    Send Reset Code
                </Button>
            </form>
        </Form>
    );
}

export function useSendResetCode(reset: UseMutationOptions<unknown, Error, SendResetCode>) {
    return useMutation<unknown, Error, SendResetCode>({
        mutationKey: ['forgot-password'],
        mutationFn: async input => {
            const response = await client.api.auth['forgot-password']['send-reset-code'].$post({
                json: input,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return { email: input.email };
        },
        ...reset,
    });
}
