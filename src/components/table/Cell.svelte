<script lang="ts">
	import type { CellSchema } from "tinybase/store";
	import type { cell as cellFunction } from "../../lib/tinystore";

	export let cell: ReturnType<typeof cellFunction>;
	export let schema: CellSchema;
</script>

<td>
	{#if schema.type === "string"}
		<input type="text" bind:value={$cell} />
	{:else if schema.type === "number"}
		<input type="number" bind:value={$cell} />
	{:else if schema.type === "boolean"}
		<!-- I wish Svelte allowed me to use TypeScript here...  -->
		<input type="checkbox" bind:checked={$cell} />
	{/if}
</td>
