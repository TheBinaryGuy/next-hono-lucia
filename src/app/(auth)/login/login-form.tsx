'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { type Login, loginSchema } from '@/schemas/auth';
import { client } from '@/server/client';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginForm() {
    const { mutate, isPending } = useMutation<unknown, Error, Login, unknown>({
        mutationKey: ['login'],
        mutationFn: json =>
            client.api.auth.login.$post({
                json,
            }),
        onSuccess: async () => {
            window.location.assign(Routes.home());
        },
        onError: () => {
            toast.error('Login failed.');
        },
    });

    const form = useForm<Login>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        criteriaMode: 'all',
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
                            <FormControl>
                                <Input
                                    autoComplete='email'
                                    placeholder='hey@example.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <div className='space-y-2 leading-none'>
                                <div className='space-y-1'>
                                    <FormLabel>Password</FormLabel>
                                </div>
                                <FormControl>
                                    <PasswordInput
                                        placeholder='Your password'
                                        autoComplete='current-password'
                                        {...field}
                                    />
                                </FormControl>
                                <ErrorMessage
                                    errors={form.formState.errors}
                                    name={field.name}
                                    render={({ messages }) =>
                                        messages &&
                                        Object.entries(messages).map(([type, message]) => (
                                            <p
                                                className='text-sm font-medium text-destructive'
                                                key={type}>
                                                {message}
                                            </p>
                                        ))
                                    }
                                />
                            </div>
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
                    Login
                </Button>
            </form>
        </Form>
    );
}
