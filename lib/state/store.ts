import {configureStore} from '@reduxjs/toolkit'
import metadataReducer from '@/state/slices/metadata'

export const store = configureStore({
	devTools: true,
	reducer: {
		metadata: metadataReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
