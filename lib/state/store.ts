import {configureStore} from '@reduxjs/toolkit'
import metadataReducer from '@/state/slices/metadata'
import peerReducer from '@/state/slices/peer'

export const store = configureStore({
	devTools: true,
	reducer: {
		metadata: metadataReducer,
		peer: peerReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
