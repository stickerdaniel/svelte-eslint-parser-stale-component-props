import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default [
	...svelte.configs.base,
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		},
		plugins: { '@typescript-eslint': ts.plugin },
		rules: { '@typescript-eslint/restrict-template-expressions': 'error' }
	}
];
