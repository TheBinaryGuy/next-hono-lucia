import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function GoogleSignIn() {
    const router = useRouter();
    return (
        <Button
            type='button'
            variant='outline'
            className='w-full flex gap-4'
            onClick={() => {
                router.push('/login/google');
            }}
        >
            <Image
                src='/images/icons/google.svg'
                alt='Google Logo'
                width={22}
                height={22}
                className='inline-block'
            />
            <span className='text-sm font-medium'>Sign in with Google</span>
        </Button>
    );
}
