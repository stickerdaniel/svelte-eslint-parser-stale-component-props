# svelte-eslint-parser: importers keep a component's old prop types

Reproduction for svelte-eslint-parser 1.9.0 with `SVELTE_ESLINT_PARSER_EXPERIMENTAL_TS_SYS_HOOK=1`.

```sh
npm install
SVELTE_ESLINT_PARSER_EXPERIMENTAL_TS_SYS_HOOK=1 node repro.js
```

`repro.js` lints like an editor integration, with one long-lived `ESLint` instance. It lints `src/Parent.svelte`, saves `src/Child.svelte` with `count: { value: number }`, lints `src/Child.svelte`, and lints `src/Parent.svelte` again. The last lint should report `@typescript-eslint/restrict-template-expressions` at 6:26, as a fresh `npx eslint src` does after the same change, but it reports nothing.

```sh
SVELTE_ESLINT_PARSER_EXPERIMENTAL_TS_SYS_HOOK=1 node cause.js
```

`cause.js` runs the same steps and prints where the import resolves and which version of each file the TypeScript program holds.

Both scripts restore `src/Child.svelte` when they finish.
