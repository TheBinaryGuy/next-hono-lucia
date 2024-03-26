/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
    bracketSpacing: true,
    bracketSameLine: true,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'es5',
    endOfLine: 'lf',
    arrowParens: 'avoid',
    tabWidth: 4,
    printWidth: 100,
    semi: true,

    importOrder: [
        '^(react/(.*)$)|^(react$)',
        '^(next/(.*)$)|^(next$)',
        '<THIRD_PARTY_MODULES>',
        '',
        '^types$',
        '^@/(.*)$',
        '',
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: '5.0.0',

    plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
};
