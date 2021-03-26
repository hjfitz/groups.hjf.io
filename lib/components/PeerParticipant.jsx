import React from 'react'

import {copy} from '../util'

const {useRef, useEffect, useState} = React

const ParticipantPlayer = ({id, stream, self}) => {
	const [muted, setMute] = useState(false)
	const player = useRef(null)
	const vidClass = self ? 'self' : ''

	// need to re-play state if we get a new stream
	useEffect(() => {
		player.current.srcObject = stream
		player.current.play()
	}, [stream])

	function toggleMute() {
		setMute((current) => {
			stream.getAudioTracks().forEach(track => track.enabled = current)
			return !current
		})
	}

	return (
		<>
			<div className="relative m-4">
				<p onClick={copy} className="absolute bottom-0 left-0 z-10 px-3 py-1 bg-black cursor-default transition duration-300 hover:opacity-100 opacity-80">{id}</p>
				<video className={vidClass} ref={player} />
			</div>
			{self && (
				<section className="absolute bottom-0 w-full bg-black ">
					<div className="flex px-4 py-4">
						<div onClick={toggleMute} className="cursor-pointer">Muted: {muted.toString()}</div>
					</div>
				</section>
			)}
		</>
	)
}

export default ParticipantPlayer
