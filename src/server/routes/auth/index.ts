import { OpenAPIHono } from '@hono/zod-openapi';

import { login } from '@/server/routes/auth/login';
import { logout } from '@/server/routes/auth/logout';
import { sendRegistrationCode } from '@/server/routes/auth/register/send-registration-code';
import { verify } from '@/server/routes/auth/register/verify';
import { ContextVariables } from '@/server/types';

export const authApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', sendRegistrationCode)
    .route('/', verify)
    .route('/', login)
    .route('/', logout);
