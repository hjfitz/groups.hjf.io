import React, {KeyboardEvent, FC} from 'react'
import {navigate, RouteComponentProps} from '@reach/router'

const {useRef} = React

const Connector: FC<RouteComponentProps> = () => {
	const input = useRef<HTMLInputElement>(null)

	const nav = () => {
		if (!input.current) return
		const {value} = input.current
		navigate(`/room/${value}`)
	}

	const keyNav = ({key}: KeyboardEvent) => {
		if (key === 'Enter') nav()
	}

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="w-64">
				<input
					className="queryin"
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
