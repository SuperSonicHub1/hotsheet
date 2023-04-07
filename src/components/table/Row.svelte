<script lang="ts">
	import type { Id } from "tinybase/common";
    import type { Store } from "tinybase/store";
	import type { TableSchema } from "../../lib/tinybase";
    import type { row as rowFunction } from "../../lib/tinystore";
    import Cell from "./Cell.svelte";

	export let row: ReturnType<typeof rowFunction>;
	export let rowId: Id;
	export let tableId: Id;
	export let schema: TableSchema;
	export let store: Store;
</script>

<tr>
	<td>{ rowId }</td>
	{#each Object.entries($row) as [cellId, cell] (cellId)}
		<Cell {cell} schema={schema[cellId]} />
	{/each}
	<td><button on:click|preventDefault={() => store.delRow(tableId, rowId)}>❌</button></td>
</tr>
