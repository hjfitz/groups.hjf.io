import {configureStore} from '@reduxjs/toolkit'
import metadataReducer from '@/state/slices/metadata'
import participantsReducer from '@/state/slices/peers'

export const store = configureStore({
	devTools: true,
	reducer: {
		metadata: metadataReducer,
		participants: participantsReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
