import React from 'react'
import {navigate} from '@reach/router'

const {useRef} = React


const Connector = () => {
	const input = useRef(null)

	const keyNav = ({key}) => {
		if (key === 'Enter') nav()
	}

	const nav = () => {
		const {value} = input.current
		navigate(`/room/${value}`)
	}

	return (
		<main className="flex flex-col items-center justify-center h-full">
			<div className="w-64">
				<input 
					className="w-full p-2 mb-2 text-black rounded" 
					ref={input} 
					onKeyUp={keyNav} 
					placeholder="Enter the Peer ID here" 
				/>
			</div>
			<p onClick={nav} className="text-center btn">Connect</p>
		</main>
	)
}

export default Connector
