import type { Id } from 'tinybase/common'
import { createStore, type CellSchema, type Store } from 'tinybase/store'

export const store = createStore()
	.setSchema({
		points: {
			x: { type: 'number' },
			y: { type: 'number' },
		}
	})
	.setTable('points',	Object.fromEntries(
		Array.from(Array(10).keys()).map(index => {
			return {x: index, y: Math.pow(index, 2)}
		}).entries()
	))


export type TableSchema = { [cellId: Id]: CellSchema }

export function tableSchema(store: Store, tableId: Id): TableSchema {
	return JSON.parse(store.getSchemaJson())[tableId]
}
