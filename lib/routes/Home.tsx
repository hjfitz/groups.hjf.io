import React, {KeyboardEvent} from 'react'
import {Link, RouteComponentProps} from '@reach/router'

import {AppContext, AppCtx} from '@/util/contexts'

const {useContext} = React

const Home: React.FC<RouteComponentProps> = () => {
	const {setName} = useContext(AppContext) as AppCtx 
	const changeName = (ev: KeyboardEvent<HTMLInputElement>) => setName((ev.target as HTMLInputElement).value)
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl">Are you hosting or joining?</h1>
			<div className="flex justify-between w-64 my-2 text-center">
				<Link className="btn" to="/host">Hosting</Link>
				<Link className="btn" to="/join">Joining</Link>
			</div>
			<div className="flex w-64">
				<input 
					className="queryin"
					placeholder="Enter your name here"
					onKeyUp={changeName} 
				/>
			</div>
		</main>
	)
}

export default Home
