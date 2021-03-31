import React from 'react'

export const AppContext = React.createContext({
	name: null,
	setName: () => {},
})

export const StreamContext = React.createContext({
	stream: null
})

export const PeerContext = React.createContext({
	peer: null,
	id: null,
})
