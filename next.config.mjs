import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

const serverEnvPath = './src/env/server';
const clientEnvPath = './src/env/client';

const { serverEnvs } = jiti(serverEnvPath);
jiti(clientEnvPath);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: serverEnvs.STANDALONE === 1 ? 'standalone' : undefined,
    swcMinify: true,
    reactStrictMode: true,
    experimental: {
        serverComponentsExternalPackages: ['@node-rs/argon2'],
    },
};

export default nextConfig;
