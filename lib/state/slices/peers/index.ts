/* eslint-disable no-param-reassign */
import {ConnectedPeer} from '@/routes/types'
import {RootState} from '@/state/store'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface ParticipantState {
	participants: ConnectedPeer[]
}

const initialState: ParticipantState = {
	participants: [],
}

export type SetParticipantsCallback = (participants: ConnectedPeer[]) => ConnectedPeer[]

export const metaSlice = createSlice({
	name: 'participants',
	initialState,
	// note, future me:
	// redux uses immer; state param is a 'draft state'
	reducers: {
		removeParticipant(state, action: PayloadAction<ConnectedPeer>) {
			state.participants = state.participants.filter((part) => part.id !== action.payload.id)
		},
		setParticipants(state, action: PayloadAction<SetParticipantsCallback>) {
			const newParticipants = action.payload([...state.participants])
			state.participants = newParticipants
		},
	},
})

export const selectParticipants = (state: RootState) => state.participants.participants

export const {removeParticipant, setParticipants} = metaSlice.actions

export default metaSlice.reducer
