import React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'
import Peer from 'peer'

const {useState, useEffect, useRef} = React

import {
	Home,
	Host,
	Connector,
	Participant,
} from './routes'
import {randID} from './util'

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

function useStream() {
	const [stream, setStream] = useState(null)
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

// todo: extract in to hook and put in host and peer
function usePeer() {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	return {peer, id}
}

const App = () => {
	const [name, setName] = useState(null)
	const stream = useStream()
	const peerDetails = usePeer()
	return (
		<div className="min-h-full text-white bg-gray-900">
			<AppContext.Provider value={{name, setName}}>
				<StreamContext.Provider value={{stream}}>
					<PeerContext.Provider value={peerDetails}>
						<Router className="h-full">
							<Home path="/" />
							<Host path="/host" />
							<Connector path="/join" />
							<Participant path="/room/:id" />
						</Router>
					</PeerContext.Provider>
				</StreamContext.Provider>
			</AppContext.Provider>
		</div>
	)
}

const entry = document.getElementById('main')

render(<App />, entry)
