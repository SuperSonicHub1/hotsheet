import { derived } from "svelte/store"
import type { Store, Table } from "tinybase/store"
import { rawTables } from "./tinystore"

function arrayifyTable(table: Table) {
	return Object
		.entries(table)
		.map(([rowId, row]) => {
			return { ...row, rowId }
		})
}

export function vegaTables(store: Store) {
	const tablesStore = rawTables(store)
	return derived(tablesStore, (tables) => {
		return Object.fromEntries(
			Object
				.entries(tables)
				.map(([tableId, table]) => [tableId, arrayifyTable(table)])
		)
	})
}
