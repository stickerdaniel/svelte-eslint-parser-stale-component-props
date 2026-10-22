// Prints where Parent.svelte's import of Child.svelte resolves and which version of each file
// the TypeScript program holds, before and after Child.svelte is saved and linted again.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { ESLint } from 'eslint';

const rel = (file) => path.relative(process.cwd(), file);
const version = (text) =>
	text?.includes('value: number') ? 'new type' : text?.includes('count: number') ? 'old type' : String(text);

const probe = {
	rules: {
		state: {
			meta: { type: 'problem', schema: [] },
			create(context) {
				return {
					ImportDeclaration(node) {
						if (node.source.value !== './Child.svelte') return;
						const { program, esTreeNodeToTSNodeMap } = context.sourceCode.parserServices;
						const specifier = esTreeNodeToTSNodeMap.get(node).moduleSpecifier;
						const target = program.getTypeChecker().getSymbolAtLocation(specifier).declarations[0];
						const held = (file) => version(program.getSourceFile(path.resolve(file))?.text);
						context.report({
							node,
							message: `import resolves to ${rel(target.getSourceFile().fileName)}; program holds Child.svelte: ${held('src/Child.svelte')}, Child.svelte.ts: ${held('src/Child.svelte.ts')}`
						});
					}
				};
			}
		}
	}
};

const eslint = new ESLint({
	overrideConfig: { files: ['**/*.svelte'], plugins: { probe }, rules: { 'probe/state': 'error' } }
});

async function lint(filePath) {
	console.log(`lint ${filePath}`);
	const [result] = await eslint.lintText(readFileSync(filePath, 'utf8'), { filePath });
	for (const m of result.messages) console.log(`  ${m.ruleId}: ${m.message}`);
}

const child = readFileSync('src/Child.svelte', 'utf8');
try {
	await lint('src/Parent.svelte');
	console.log('save src/Child.svelte with count: { value: number }');
	writeFileSync('src/Child.svelte', child.replace('count: number', 'count: { value: number }'));
	await lint('src/Child.svelte');
	console.log(`ts.sys.readFile('src/Child.svelte.ts') returns: ${version(ts.sys.readFile(path.resolve('src/Child.svelte.ts')))}`);
	await lint('src/Parent.svelte');
} finally {
	writeFileSync('src/Child.svelte', child);
}
