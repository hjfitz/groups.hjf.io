import React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'

const {useState} = React

import {
	Home,
	Host,
	Connector,
	Participant,
} from './routes'

import {UserBar} from './components/PeerParticipant'

import {AppContext, StreamContext, PeerContext} from './util/contexts'
// todo: handle this better
import {useStream, usePeer} from './util/hooks'

const App = () => {
	const [name, setName] = useState(null)
	const stream = useStream()
	const peerDetails = usePeer()
	return (
		<div className="h-full text-white bg-gray-900">
			<div className="h-full">
				<AppContext.Provider value={{name, setName}}>
					<StreamContext.Provider value={{stream}}>
						<PeerContext.Provider value={peerDetails}>
							<Router className="">
								<Home path="/" />
								<Host path="/host" />
								<Connector path="/join" />
								<Participant path="/room/:id" />
							</Router>
						</PeerContext.Provider>
					</StreamContext.Provider>
				</AppContext.Provider>
			</div>
			<UserBar stream={stream} />
		</div>
	)
}

const entry = document.getElementById('main')

render(<App />, entry)
