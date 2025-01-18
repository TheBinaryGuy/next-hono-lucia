import { headers } from 'next/headers';
import { TokenBucket } from './rate-limit';

export const globalBucket = new TokenBucket<string>(100, 1);

export async function globalGETRateLimit(): Promise<boolean> {
    // Note: Assumes X-Forwarded-For will always be defined.
    const clientIP = (await headers()).get('X-Forwarded-For');
    if (clientIP === null) {
        return true;
    }
    return globalBucket.consume(clientIP, 1);
}

export async function globalPOSTRateLimit(): Promise<boolean> {
    // Note: Assumes X-Forwarded-For will always be defined.
    const clientIP = (await headers()).get('X-Forwarded-For');
    if (clientIP === null) {
        return true;
    }
    return globalBucket.consume(clientIP, 3);
}
