// Lints like an editor integration: one long-lived ESLint instance, files passed as text.
import { readFileSync, writeFileSync } from 'node:fs';
import { ESLint } from 'eslint';

const eslint = new ESLint();

async function lint(filePath) {
	const [result] = await eslint.lintText(readFileSync(filePath, 'utf8'), { filePath });
	console.log(filePath, result.messages.map((m) => `${m.line}:${m.column} ${m.message}`));
}

const child = readFileSync('src/Child.svelte', 'utf8');
try {
	await lint('src/Parent.svelte');
	// Change a prop type in Child.svelte and save it, then lint both files again.
	writeFileSync('src/Child.svelte', child.replace('count: number', 'count: { value: number }'));
	await lint('src/Child.svelte');
	await lint('src/Parent.svelte');
} finally {
	writeFileSync('src/Child.svelte', child);
}
