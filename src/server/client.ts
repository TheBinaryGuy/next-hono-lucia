import { hc } from 'hono/client';
import { $fetch } from 'ofetch';

import { getBaseUrl } from '@/lib/utils';
import { type AppType } from '@/server';

export const client = hc<AppType>(getBaseUrl(), {
    fetch(input, requestInit, _, __) {
        return $fetch(input instanceof URL ? input.toString() : input, requestInit);
    },
});
