import { hc } from 'hono/client';

import { getBaseUrl } from '@/lib/utils';
import { type AppType } from '@/server';

export const client = hc<AppType>(getBaseUrl());
