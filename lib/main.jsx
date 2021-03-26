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
	<Router className="h-full">
		<Home path="/" />
		<Host path="/host" />
		<Connector path="/join" />
		<Participant path="/room/:id" />
	</Router>
)

const entry = document.getElementById('main')

render(<App />, entry)
