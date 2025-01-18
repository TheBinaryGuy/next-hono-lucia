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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { PasswordInput } from '@/components/ui/password-input';
import { Routes } from '@/lib/routes';
import { verifySchema as mainVerifySchema } from '@/schemas/auth';
import { client } from '@/server/client';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSendResetCode } from '../../forgot-password/forgot-password-form';
import { useTimer } from '@/lib/hooks/useTimer';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';

const verifySchema = mainVerifySchema
    .extend({
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type Verify = z.infer<typeof verifySchema>;

export function VerificationForm({ email }: { email: string }) {
    const { seconds, isActive, startTimer } = useTimer();

    const form = useForm<Verify>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            confirmationCode: '',
            email,
            password: '',
        },
        criteriaMode: 'all',
    });

    const router = useRouter();
    const { mutate, isPending } = useMutation<unknown, Error, Verify>({
        mutationKey: ['user-verification'],
        mutationFn: async json => {
            const response = await client.api.auth.register.verify.$post({
                json,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
        },
        onSuccess: () => {
            router.push(Routes.dashboard());
        },
        onError: () => {
            toast.error('Registration failed. Please try again.');
        },
    });

    const { mutate: resendCode, isPending: isResending } = useSendResetCode({
        onSuccess: () => {
            startTimer();
            toast.success('New code sent to your email');
        },
        onError: () => {
            toast.error('Failed to resend code');
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(values => mutate(values))} className='space-y-4'>
                <FormField
                    control={form.control}
                    name='confirmationCode'
                    render={({ field }) => (
                        <FormItem>
                            <div className='space-y-2 leading-none'>
                                <div className='flex items-center justify-between'>
                                    <div className='space-y-1'>
                                        <FormLabel>Confirmation Code</FormLabel>
                                        <FormDescription>
                                            Check your email for the code.
                                        </FormDescription>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='link'
                                        size='sm'
                                        onClick={() =>
                                            resendCode({
                                                email,
                                            })
                                        }
                                        disabled={isResending || isActive}>
                                        {isActive ? `Resend in ${seconds}s` : 'Resend Code'}
                                    </Button>
                                </div>
                                <FormControl>
                                    <InputOTP maxLength={8} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                            <InputOTPSlot index={6} />
                                            <InputOTPSlot index={7} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <div className='space-y-2 leading-none'>
                                <div className='space-y-1'>
                                    <FormLabel>Password</FormLabel>
                                    <FormDescription>Choose a strong password.</FormDescription>
                                </div>
                                <FormControl>
                                    <PasswordInput {...field} />
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
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <div className='space-y-2 leading-none'>
                                <div className='space-y-1'>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormDescription>Re-enter your new password.</FormDescription>
                                </div>
                                <FormControl>
                                    <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Button type='submit' isPending={isPending}>
                    Continue
                </Button>
            </form>
        </Form>
    );
}
