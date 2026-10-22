<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Child from './Child.svelte';

	let { child }: { child: ComponentProps<typeof Child> } = $props();
	const label = `Count: ${child.count}`;
</script>

<Child {...child} />
<p>{label}</p>
