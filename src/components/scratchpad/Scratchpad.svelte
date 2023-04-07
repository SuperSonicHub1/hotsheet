<script lang="ts">
	import * as math from "mathjs"
	import { store } from "../../lib/tinybase"
    import { rawTables } from "../../lib/tinystore";

	const parser = math.parser()

	const tables = rawTables(store)
	$: {
		for (const [tableId, table] of Object.entries($tables)) {
			parser.set(tableId, table)
		}
	}

	let lines = []

	function evaluate(e: Event & { currentTarget: EventTarget & HTMLFormElement }) {
		const form  = e.currentTarget
		const input = form.elements['input'] as HTMLInputElement,
			{ value } = input
		lines = [...lines, value, parser.evaluate(value)]
	}
</script>

<output name="calculations" for="input">
	{#each lines as line}
		<p>{ line }</p>
	{/each}
</output>
<form on:submit|preventDefault={evaluate}>
	<input type="text" name="input" id="input"><button type="submit">Eval</button>
</form>

<style>
	input {
		width: 50%;
	}
</style>
