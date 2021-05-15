import React, {useEffect} from 'react'
import {render} from 'react-dom'
import {LocationProvider, Router} from '@reach/router'
import {Provider} from 'react-redux'

import {
	Home,
	Host,
	Connector,
	Participant,
} from '@/routes'

import {PeerContext, ParticipantsContext} from '@/contexts/providers'
import {useStream, usePeer} from '@/util/hooks'
import {UserBar} from '@/components'
import {ConnectedPeer} from '@/routes/types'
import {store} from '@/state/store'
import {useAppDispatch} from '@/state/hooks'
import {stream as dispatchStream} from '@/state/slices/peer'

// awful react hack for snowpack
const {useState} = React

const App = () => {
	const dispatch = useAppDispatch()
	// todo: consolidate hooks where appropriate
	const [participants, setParticipants] = useState<ConnectedPeer[]>([])
	const stream = useStream()
	useEffect(() => {
		if (!stream) return
		dispatch(dispatchStream(stream))
	}, [stream])
	const peerDetails = usePeer()

	return (
		<LocationProvider>
			<div className="text-white bg-gray-900">
				<div className="">
					<ParticipantsContext.Provider value={{participants, setParticipants}}>
						<PeerContext.Provider value={peerDetails}>
							<Router className="">
								<Home path="/" />
								<Host path="/host" />
								<Connector path="/join" />
								<Participant path="/room/:id" />
							</Router>
						</PeerContext.Provider>
					</ParticipantsContext.Provider>
				</div>
				<UserBar stream={stream} />
			</div>
		</LocationProvider>
	)
}

const entry = document.getElementById('main')

if (entry) {
	render((
		<Provider store={store}>
			<App />
		</Provider>
	), entry)
}
