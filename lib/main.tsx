import React from 'react'
import {render} from 'react-dom'
import {LocationProvider, Router} from '@reach/router'
import {Provider} from 'react-redux'

import {
	Home,
	Host,
	Connector,
	Participant,
} from '@/routes'

import {StreamContext, PeerContext, ParticipantsContext} from '@/contexts/providers'
import {useStream, usePeer} from '@/util/hooks'
import {UserBar} from '@/components'
import {ConnectedPeer} from '@/routes/types'
import {store} from '@/state/store'

// awful react hack for snowpack
const {useState} = React

const App = () => {
	// todo: consolidate hooks where appropriate
	const [participants, setParticipants] = useState<ConnectedPeer[]>([])
	const stream = useStream()
	const peerDetails = usePeer()

	return (
		<Provider store={store}>
			<LocationProvider>
				<div className="text-white bg-gray-900">
					<div className="">
						<ParticipantsContext.Provider value={{participants, setParticipants}}>
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
						</ParticipantsContext.Provider>
					</div>
					<UserBar stream={stream} />
				</div>
			</LocationProvider>
		</Provider>
	)
}

const entry = document.getElementById('main')

if (entry) render(<App />, entry)
