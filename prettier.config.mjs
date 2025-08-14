/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  tabWidth: 2,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
