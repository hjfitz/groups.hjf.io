import React from 'react'

import {copy} from '../util'
import {AppContext} from '../util/contexts'

const {useRef, useEffect, useState, useContext} = React

// todo: potentially split stream in to a context and move this to the root?
export const UserBar = ({stream}) => {
	const [muted, setMute] = useState(false)
	function toggleMute() {
		setMute((current) => {
			stream.getAudioTracks().forEach(track => track.enabled = current)
			return !current
		})
	}
	return (
		<section className="fixed bottom-0 z-20 w-full bg-black ">
			<div className="flex px-4 py-4">
				<div onClick={toggleMute} className="cursor-pointer">Muted: {muted.toString()}</div>
			</div>
		</section>
	)
}

const ParticipantPlayer = ({id, displayName, stream, self}) => {
	const {name} = useContext(AppContext)
	if (!displayName && !name) {
		displayName = id
	}
	const player = useRef(null)
	const vidClass = self ? 'self' : ''

	// need to re-play state if we get a new stream
	useEffect(() => {
		player.current.srcObject = stream
		player.current.play()
	}, [stream])


	return (
		<>
			<div className="relative m-4 participant">
				<p 
					onClick={copy(id)} 
					className="absolute bottom-0 left-0 z-10 px-3 py-1 bg-black cursor-default transition duration-300 hover:opacity-100 opacity-80"
				>
					{(self && name) ? name : displayName}
				</p>
				<video className={vidClass} ref={player} />
			</div>
			{/*self && <UserBar stream={stream} />*/}
		</>
	)
}

export default ParticipantPlayer
