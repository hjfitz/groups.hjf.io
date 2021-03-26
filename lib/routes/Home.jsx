import React from 'react'
import {Link} from '@reach/router'

const Home = () => (
	<main className="flex flex-col items-center justify-center h-full">
		<h1 className="text-3xl">Are you hosting or joining?</h1>
		<div className="flex mt-2 text-center">
			<Link className="btn" to="/host">Hosting</Link>
			<Link className="btn" to="/join">Joining</Link>
		</div>
	</main>
)

export default Home
