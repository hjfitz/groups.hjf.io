/* eslint-disable no-param-reassign */
import {RootState} from '@/state/store'
import {randID} from '@/util'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import Peer from 'peerjs'

export interface PeerState {
	stream?: MediaStream
	id: string
}

const curId = randID()

export const peer = new Peer(curId)

const initialState: PeerState = {
	id: curId,
}

export const peerSlice = createSlice({
	name: 'peer',
	initialState,
	// note, future me:
	// redux uses immer; state param is a 'draft state'
	reducers: {
		stream(state, action: PayloadAction<MediaStream>) {
			state.stream = action.payload
		},
	},
})

export const selectId = (state: RootState) => state.peer.id
export const selectStream = (state: RootState) => state.peer.stream

export const {stream} = peerSlice.actions

export default peerSlice.reducer
