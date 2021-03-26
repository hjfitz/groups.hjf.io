import * as React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'

import {
	Home,
	Host,
	Connector,
	Participant,
} from './routes'


const App = () => (
	<div className="h-full text-white bg-gray-900">
		<Router className="h-full">
			<Home path="/" />
			<Host path="/host" />
			<Connector path="/join" />
			<Participant path="/room/:id" />
		</Router>
	</div>
)

const entry = document.getElementById('main')

render(<App />, entry)
