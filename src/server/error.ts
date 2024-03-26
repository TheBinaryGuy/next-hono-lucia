export class ApiError extends Error {
    constructor(
        message: string,
        public data: unknown = {},
        public status: number = 500
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
