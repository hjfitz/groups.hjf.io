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

export const AppContext = React.createContext({
	name: null,
	setName: () => {},
})

const App = () => {
	const [name, setName] = useState(null)
	return (
		<div className="min-h-full text-white bg-gray-900">
			<AppContext.Provider value={{name, setName}}>
				<Router className="h-full">
					<Home path="/" />
					<Host path="/host" />
					<Connector path="/join" />
					<Participant path="/room/:id" />
				</Router>
			</AppContext.Provider>
		</div>
	)
}

const entry = document.getElementById('main')

render(<App />, entry)
