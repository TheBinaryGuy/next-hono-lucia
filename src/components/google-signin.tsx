import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function GoogleSignIn() {
    return (
        <Button
            type='button'
            variant='outline'
            className={cn(
                'flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-50'
            )}>
            <Image
                src='/images/icons/google.svg'
                alt='Google Logo'
                width={24}
                height={24}
                className='inline-block'
            />
            <span className='text-sm font-medium'>Sign in with Google</span>
        </Button>
    );
}
