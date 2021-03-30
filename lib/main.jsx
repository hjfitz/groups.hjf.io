import React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'

const {useState, useEffect} = React

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

export const StreamContext = React.createContext({
	stream: null
})

export function useStream() {
	const [stream, setStream] = useState(null)
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

const App = () => {
	const [name, setName] = useState(null)
	const stream = useStream()
	return (
		<div className="min-h-full text-white bg-gray-900">
			<AppContext.Provider value={{name, setName}}>
				<StreamContext.Provider value={{stream}}>
					<Router className="h-full">
						<Home path="/" />
						<Host path="/host" />
						<Connector path="/join" />
						<Participant path="/room/:id" />
					</Router>
				</StreamContext.Provider>
			</AppContext.Provider>
		</div>
	)
}

const entry = document.getElementById('main')

render(<App />, entry)
