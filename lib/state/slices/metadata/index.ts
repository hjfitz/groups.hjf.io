/* eslint-disable no-param-reassign */
import {RootState} from '@/state/store'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface MetaState {
	name: string
	host: string
}

const initialState: MetaState = {
	name: '',
	host: '',
}

export const metaSlice = createSlice({
	name: 'metadata',
	initialState,
	// note, future me:
	// redux uses immer; state param is a 'draft state'
	reducers: {
		name(state, action: PayloadAction<string>) {
			state.name = action.payload
		},
		host(state, action: PayloadAction<string>) {
			state.host = action.payload
		},
	},
})

export const selectName = (state: RootState) => state.metadata.name
export const selectHost = (state: RootState) => state.metadata.host
export const selectShareLink = (state: RootState) => {
	const {origin} = window.location
	const newUrl = `${origin}/room/${state.metadata.host}`
	return newUrl
}

export const {name, host} = metaSlice.actions

export default metaSlice.reducer
