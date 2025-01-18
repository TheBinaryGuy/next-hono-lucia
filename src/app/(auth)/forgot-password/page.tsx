import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/forgot-password-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Routes } from '@/lib/routes';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Reset your password',
};

export default function ForgotPasswordPage() {
    return (
        <div className='flex h-full items-center'>
            <Card className='mx-auto w-[32rem] max-w-lg'>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your email to reset your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
                <CardFooter className='flex-col items-start gap-2 text-sm'>
                    <div>
                        <span>Remember your password? </span>
                        <Link className='text-blue-600 underline' href={Routes.login()}>
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
