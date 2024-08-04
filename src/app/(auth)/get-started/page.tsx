import { RegisterForm } from '@/app/(auth)/get-started/register-form';
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
    title: 'Get Started',
    description: 'Get Started',
};

export default function GetStartedPage() {
    return (
        <div className='flex h-full items-center'>
            <Card className='mx-auto w-[32rem] max-w-lg'>
                <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Welcome!</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
                <CardFooter className='flex-col items-start gap-2 text-sm'>
                    <div>
                        <span>Already have an account? </span>
                        <Link className='text-blue-600 underline' href={Routes.login()}>
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
