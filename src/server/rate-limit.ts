export class TokenBucket<_Key> {
    public max: number;
    public refillIntervalSeconds: number;

    constructor(max: number, refillIntervalSeconds: number) {
        this.max = max;
        this.refillIntervalSeconds = refillIntervalSeconds;
    }

    private storage = new Map<_Key, Bucket>();

    public check(key: _Key, cost: number): boolean {
        const bucket = this.storage.get(key) ?? null;
        if (bucket === null) {
            return true;
        }
        const now = Date.now();
        const refill = Math.floor((now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));
        if (refill > 0) {
            return Math.min(bucket.count + refill, this.max) >= cost;
        }
        return bucket.count >= cost;
    }

    public consume(key: _Key, cost: number): boolean {
        let bucket = this.storage.get(key) ?? null;
        const now = Date.now();
        if (bucket === null) {
            bucket = {
                count: this.max - cost,
                refilledAt: now,
            };
            this.storage.set(key, bucket);
            return true;
        }
        const refill = Math.floor((now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));
        if (refill > 0) {
            bucket.count = Math.min(bucket.count + refill, this.max);
            bucket.refilledAt = now;
        }
        if (bucket.count < cost) {
            this.storage.set(key, bucket);
            return false;
        }
        bucket.count -= cost;
        this.storage.set(key, bucket);
        return true;
    }
}
interface Bucket {
    count: number;
    refilledAt: number;
}
