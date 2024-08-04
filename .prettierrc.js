/** @type {import("prettier").PrettierConfig} */
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

    plugins: ['prettier-plugin-tailwindcss'],
};
