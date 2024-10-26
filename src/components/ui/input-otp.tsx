'use client';

import { cn } from '@/lib/utils';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Dot } from 'lucide-react';
import * as React from 'react';

export function InputOTP({
    ref,
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput>) {
    return (
        <OTPInput
            ref={ref}
            containerClassName={cn(
                'flex items-center gap-2 has-[:disabled]:opacity-50',
                containerClassName
            )}
            className={cn('disabled:cursor-not-allowed', className)}
            {...props}
        />
    );
}

export function InputOTPGroup({ ref, className, ...props }: React.ComponentProps<'div'>) {
    return <div ref={ref} className={cn('flex items-center', className)} {...props} />;
}

export function InputOTPSlot({
    ref,
    index,
    className,
    ...props
}: React.ComponentProps<'div'> & { index: number }) {
    const inputOTPContext = React.useContext(OTPInputContext);

    const slotProps = inputOTPContext.slots[index];
    if (!slotProps) {
        return null;
    }

    const { char, hasFakeCaret, isActive } = slotProps;

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
                isActive && 'z-10 ring-2 ring-ring ring-offset-background',
                className
            )}
            {...props}>
            {char}
            {hasFakeCaret && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
                </div>
            )}
        </div>
    );
}

export function InputOTPSeparator(props: React.ComponentProps<'div'>) {
    return (
        <div role='separator' {...props}>
            <Dot />
        </div>
    );
}
