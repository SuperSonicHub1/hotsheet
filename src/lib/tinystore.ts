import { map } from "@accuser/svelte-store-array"
import { derived, readable, writable, type Readable, type Writable } from "svelte/store"
import type { Id } from "tinybase/common"
import type { CellOrUndefined, Store } from "tinybase/store"
import { tableSchema } from "./tinybase"

// Code inspired by https://github.com/babichjacob/svelte-localstorage/blob/main/projects/svelte-localstorage/browser.js
export function cell(store: Store, tableId: Id, rowId: Id, cellId: Id): Writable<CellOrUndefined> {
	let currentValue = store.getCell(tableId, rowId, cellId)

	const sync = (value) => {
		setStore(value)
		currentValue = value
	}

	const set = (value) => {
		sync(value)
		store.setCell(tableId, rowId, cellId, value)
	}

	const update = (fn) => {
		set(fn(currentValue))
	}

	const { set: setStore, subscribe } = writable(currentValue, (_set) => {
		const listenerId = store.addCellListener(
			tableId,
			rowId,
			cellId,
			(_store, _tableId, _rowId, _cellId, newCell) => {
				sync(newCell)
			}
		)

		return () => store.delListener(listenerId)
	})


	return { subscribe, set, update }
}

export function row(store: Store, tableId: Id, rowId: Id) {
	const cellIds = readable(store.getCellIds(tableId, rowId), (set) => {
		const listenerId = store.addCellIdsListener(tableId, rowId, () => {
			set(store.getCellIds(tableId, rowId))
		})

		return () => store.delListener(listenerId)
	})

	return derived(cellIds, (cellIds) => Object.fromEntries(
		cellIds
			// .sort((a, b) => a.localeCompare(b))
			.map(cellId => [cellId, cell(store, tableId, rowId, cellId)])
	)
	)
}

export function table(store: Store, tableId: Id) {
	const rowIds = readable(store.getRowIds(tableId), (set) => {
		const listenerId = store.addRowIdsListener(tableId, () => {
			set(store.getRowIds(tableId))
		})

		return () => store.delListener(listenerId)
	})

	return derived(rowIds, (rowIds) => Object.fromEntries(
		rowIds.map(rowId => [rowId, row(store, tableId, rowId)])
	)
	)
}

export function tableIds(store: Store) {
	return readable(store.getTableIds(), (set) => {
		const listenerId = store.addTableIdsListener(() => {
			set(store.getTableIds())
		})
	
		return () => store.delListener(listenerId)
	})
	
}

export function tables(store: Store) {
	const ids = tableIds(store)
	return map(ids, (tableId) => {
		return {
			tableId,
			table: table(store, tableId),
			schema: tableSchema(store, tableId)
		}
	})
}

export function rawTables(store: Store) {
	return readable(store.getTables(), (set) => {
		const listenerId = store.addTablesListener(() => {
			set(store.getTables())
		})

		return () => store.delListener(listenerId)
	})
}
