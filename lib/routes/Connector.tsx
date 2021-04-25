import React, {KeyboardEvent, FC} from 'react'
import {navigate} from '@reach/router'
import {RoutedComponent} from '@/routes/types'

const {useRef} = React


const Connector: FC<RoutedComponent> = () => {
	const input = useRef<HTMLInputElement>(null)

	const keyNav = ({key}: KeyboardEvent) => {
		if (key === 'Enter') nav()
	}

	const nav = () => {
		if (!input.current) return
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
