import createJiti from 'jiti';
import { fileURLToPath } from 'node:url';

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
    webpack: config => {
        config.module.rules.push({
            test: /\.m?js$/,
            type: 'javascript/auto',
            resolve: {
                fullySpecified: false,
            },
        });

        return config;
    },
};

export default nextConfig;
