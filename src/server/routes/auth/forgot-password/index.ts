import type { ContextVariables } from '@/server/types';
import { OpenAPIHono } from '@hono/zod-openapi';
import { sendResetCode } from './send-reset-code';
import { resetPassword } from './reset-password';

export const forgotPasswordApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', sendResetCode)
    .route('/', resetPassword);
