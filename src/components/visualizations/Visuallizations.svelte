<script lang="ts">
	import type { VisualizationSpec } from "svelte-vega";
	import { VegaLite } from "svelte-vega";
	import * as Hjson from "hjson";

	import { store } from "../../lib/tinybase";
	import { vegaTables } from "../../lib/vega";

	const data = vegaTables(store);
	let specText: string = Hjson.stringify({
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
	});
	let spec: VisualizationSpec;
	$: {
		try {
			spec = Hjson.parse(specText);
		} catch (error) {
			console.error(error)
		}
	}
</script>

<VegaLite data={$data} {spec} />
<br>
<textarea bind:value={specText} cols="30" rows="10" />
