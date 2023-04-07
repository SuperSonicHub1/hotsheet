<script lang="ts">
	import type { Id } from "tinybase/common";
	import type { Store } from "tinybase/store";
	import type { TableSchema } from "../../lib/tinybase";
	import type { table as tableFunction } from "../../lib/tinystore";
	import Row from "./Row.svelte";

	
	export let table: ReturnType<typeof tableFunction>;
	export let tableId: Id;
	export let schema: TableSchema;
	export let store: Store;

	const rowIdName = "tableId"

	function addRow(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		const form  = e.currentTarget
		const { elements } = form 
		const row = {}
		let rowId
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].nodeName === "INPUT") {
				const element = elements[i] as HTMLInputElement,
					{ type } = element
				
				if (element.name === rowIdName) rowId = element.value
				else row[element.name] = type === 'checkbox' ? element.checked :
					type === 'number' ? element.valueAsNumber : element.value
				
				type === 'checkbox' ? (element.checked = false) : (element.value = "") 
			}
		}

		store.setRow(tableId, rowId, row)
	}
</script>

<h4>Add Table</h4>
<form on:submit|preventDefault={addRow}>
	<label>
		ID: <input type="text" required name={rowIdName} />
	</label>
	<br>

	{#each Object.entries(schema) as [cellId, cellSchema]}
		{@const id = `${tableId}.${cellId}`}
		<label for={id}>{cellId}: </label>
		{#if cellSchema.type === "string"}
			<input type="text" name={cellId} {id} />
		{:else if cellSchema.type === "number"}
			<input type="number" required name={cellId} {id} />
		{:else if cellSchema.type === "boolean"}
			<input type="checkbox" name={cellId} {id} />
		{/if}
		<br />
	{/each}

	<br>
	<button type="submit">Add</button>
</form>

<br />

<table>
	<thead>
		<tr>
			<th><em>rowId</em></th>
			{#each Object.keys(schema) as cellId}
				<th>{cellId}</th>
			{/each}
			<th><em>Delete</em></th>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries($table) as [rowId, row] (rowId)}
			<Row {store} {schema} {tableId} {rowId} {row} />
		{/each}
	</tbody>
</table>
