import React from 'react'

const {useRef, useEffect} = React

const ParticipantPlayer = ({id, stream}) => {
	const player = useRef(null)
	useEffect(() => {
		player.current.srcObject = stream
		player.current.play()
	}, [])

	return (
		<div className="relative">
			<p className="absolute bottom-0 left-0 z-10 opacity-80">{id}</p>
			<video ref={player} />
		</div>
	)
}

export default ParticipantPlayer
