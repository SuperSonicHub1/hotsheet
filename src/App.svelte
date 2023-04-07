<script lang="ts">
  import Scratchpad from "./components/scratchpad/Scratchpad.svelte";
  import Visualizations from "./components/visualizations/Visuallizations.svelte";
  import Table from "./components/table/Table.svelte";
  import { store } from "./lib/tinybase";
  import { tables } from "./lib/tinystore";
  const allTables = tables(store);
</script>

<main>
  <details open>
    <summary><h2>Tables</h2></summary>
    {#each $allTables as { tableId, table, schema } (tableId)}
      <h3>{tableId}</h3>
      <Table {table} {tableId} {schema} {store} />
    {/each}
  </details>

  <details open>
    <summary><h2>Scratchpad</h2></summary>
    <Scratchpad />
  </details>

  <details open>
    <summary><h2>Visualizations</h2></summary>
    <Visualizations />
  </details>
</main>

<style>
</style>
