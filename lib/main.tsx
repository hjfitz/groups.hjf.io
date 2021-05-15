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

import {useStream} from '@/util/hooks'
import {UserBar} from '@/components'
import {store} from '@/state/store'
import {StreamContext} from '@/state/contexts'

const App = () => {
	// todo: consolidate hooks where appropriate
	const stream = useStream()

	return (
		<LocationProvider>
			<StreamContext.Provider value={stream}>
				<div className="text-white bg-gray-900">
					<div className="">
						<Router>
							<Home path="/" />
							<Host path="/host" />
							<Connector path="/join" />
							<Participant path="/room/:id" />
						</Router>
					</div>
					<UserBar stream={stream} />
				</div>
			</StreamContext.Provider>
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
