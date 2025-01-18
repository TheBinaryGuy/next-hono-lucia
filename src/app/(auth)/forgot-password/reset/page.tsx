import { ResetPasswordForm } from '@/app/(auth)/forgot-password/reset/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Routes } from '@/lib/routes';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Enter your new password',
};

export default async function ResetPasswordPage(props: {
    searchParams: Promise<{ email: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const { email } = searchParams;

    if (!email || Array.isArray(email)) {
        return redirect(Routes.forgotPassword());
    }

    return (
        <div className='flex h-full items-center'>
            <Card className='mx-auto w-[32rem] max-w-lg'>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter the code sent to your email</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm email={email} />
                </CardContent>
            </Card>
        </div>
    );
}
