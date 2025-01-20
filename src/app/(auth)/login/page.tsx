import { LoginForm } from '@/app/(auth)/login/login-form';
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
    title: 'Login',
    description: 'Welcome back!',
};

export default async function LoginPage() {
    return (
        <div className='flex h-full items-center'>
            <Card className='mx-auto w-[32rem] max-w-lg'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Welcome back!</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className='flex-col items-start gap-2 text-sm'>
                    <div>
                        <span>Don&apos;t have an account? </span>
                        <Link className='text-blue-600 underline' href={Routes.register()}>
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
