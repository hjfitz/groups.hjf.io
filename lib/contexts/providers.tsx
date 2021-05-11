import React, {Dispatch, SetStateAction} from 'react'
import Peer from 'peerjs'
import {ConnectedPeer} from '@/routes/types'

export interface AppCtx {
	name: string
	setName: Dispatch<SetStateAction<string>>

	host: string
	setHost: Dispatch<SetStateAction<string>>
}

export interface StreamCtx {
	stream: MediaStream
}

export interface PeerCtx {
	peer: React.MutableRefObject<Peer>
	id: React.MutableRefObject<string>
}

export interface ParticipantsCtx {
	participants: ConnectedPeer[]
	setParticipants: Dispatch<SetStateAction<ConnectedPeer[]>>
}

export const AppContext = React.createContext<Partial<AppCtx>>({})
export const StreamContext = React.createContext<Partial<StreamCtx>>({})
export const PeerContext = React.createContext<Partial<PeerCtx>>({})

export const ParticipantsContext = React.createContext<ParticipantsCtx>({
	participants: [],
	setParticipants: () => {},
})
