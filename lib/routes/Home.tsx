import React, {KeyboardEvent} from 'react'
import {Link} from '@reach/router'

import {AppContext, AppCtx} from '@/util/contexts'
import {RoutedComponent} from '@/routes/types'

const {useContext} = React

const Home: React.FC<RoutedComponent> = () => {
	const {setName} = useContext(AppContext) as AppCtx 
	const changeName = (ev: KeyboardEvent<HTMLInputElement>) => setName((ev.target as HTMLInputElement).value)
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
