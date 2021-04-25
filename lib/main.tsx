import React from 'react'
import {render} from 'react-dom'
import {LocationProvider, Router} from '@reach/router'

import {
	Home,
	Host,
	Connector,
	Participant,
} from '@/routes'

import {AppContext, StreamContext, PeerContext} from '@/util/contexts'
import {useStream, usePeer} from '@/util/hooks'
import {UserBar} from '@/components'

// awful react hack for snowpack
const {useState} = React

const App = () => {
	const [name, setName] = useState<string>('')
	const stream = useStream()
	const peerDetails = usePeer()

	return (
		<LocationProvider>
			<div className="text-white bg-gray-900">
				<div className="">
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
		</LocationProvider>
	)
}

const entry = document.getElementById('main')

if (entry) render(<App />, entry)
