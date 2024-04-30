import createJiti from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);

const { serverEnvs } = jiti('./src/env/server');
jiti('./src/env/client');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: serverEnvs.STANDALONE === 1 ? 'standalone' : undefined,
    swcMinify: true,
    reactStrictMode: true,
    webpack: config => {
        config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
        return config;
    },
};

export default nextConfig;
