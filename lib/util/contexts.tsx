import React from 'react'
import Peer from 'peerjs'

export interface AppCtx {
	name: string
	setName: Function
}

export interface StreamCtx {
	stream: MediaStream
}

export interface PeerCtx {
	peer: React.MutableRefObject<Peer>
	id: React.MutableRefObject<string>
}

export const AppContext = React.createContext<Partial<AppCtx>>({})
export const StreamContext = React.createContext<Partial<StreamCtx>>({})
export const PeerContext = React.createContext<Partial<PeerCtx>>({})
