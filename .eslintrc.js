module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['tailwindcss', '@typescript-eslint'],
    extends: [
        'next/core-web-vitals',
        'prettier',
        'plugin:tailwindcss/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    settings: {
        tailwindcss: {
            callees: ['cn', 'clsx', 'tw'],
        },
    },
    rules: {
        'react/jsx-key': 'error',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        semi: ['error', 'always'],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                depth: 3,
            },
        ],
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/classnames-order': 'off',
    },
    ignorePatterns: [
        '**/*.js',
        '**/*.json',
        'node_modules',
        'public',
        'styles',
        '.next',
        'coverage',
        'dist',
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
};
