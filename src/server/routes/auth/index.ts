import { OpenAPIHono } from '@hono/zod-openapi';

import { login } from '@/server/routes/auth/login';
import { logout } from '@/server/routes/auth/logout';
import { registerApp } from '@/server/routes/auth/register';
import type { ContextVariables } from '@/server/types';

export const authApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', registerApp)
    .route('/', login)
    .route('/', logout);
