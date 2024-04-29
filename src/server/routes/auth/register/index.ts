import { OpenAPIHono } from '@hono/zod-openapi';

import { ContextVariables } from '@/server/types';

import { sendRegistrationCode } from './send-registration-code';
import { verify } from './verify';

export const registerApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', sendRegistrationCode)
    .route('/', verify);
