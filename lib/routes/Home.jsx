import React from 'react'
import {Link} from '@reach/router'

import {AppContext} from '../util/contexts'

const {useContext} = React

const Home = () => {
	const {setName} = useContext(AppContext)
	const changeName = (ev) => setName(ev.target.value)
	return (
		<main className="flex flex-col items-center justify-center h-full">
			<h1 className="text-3xl">Are you hosting or joining?</h1>
			<div className="flex justify-between w-64 my-2 text-center">
				<Link className="btn" to="/host">Hosting</Link>
				<Link className="btn" to="/join">Joining</Link>
			</div>
			<div className="flex w-64">
				<input 
					className="w-full px-4 py-2 mx-2 text-white bg-gray-600 rounded" 
					placeholder="Enter your name here"
					onKeyUp={changeName} 
				/>
			</div>
		</main>
	)
}

export default Home
