import React from 'react'

import {copy, usePeer} from '@/util'
import {AppContext, AppCtx, PeerCtx} from '@/util/contexts'

const {useRef, useEffect, useContext} = React

interface PlayerProps {
	id: string
	displayName?: string
	stream: MediaStream
}

const ParticipantPlayer: React.FC<PlayerProps> = ({id, displayName, stream}) => {
	const {name} = useContext(AppContext) as AppCtx
	const {id: selfID} = usePeer() as PeerCtx
	const self = id === selfID.current
	if (!displayName && !name) {
		displayName = id
	}
	const player = useRef<HTMLVideoElement>(null)
	const nameTag = useRef<HTMLParagraphElement>(null)
	const vidClass = self ? 'self' : ''

	// need to re-play state if we get a new stream
	useEffect(() => {
		if (!player || !player.current) return
		player.current.srcObject = stream
		player.current.play()
		player.current.addEventListener('playing', () => {
			if (!player.current || !nameTag.current) return
			const {width} = player.current.getBoundingClientRect()
			nameTag.current.style.width = `${width}px`
		})
	}, [stream])


	return (
			<div className="flex items-center justify-center h-full p-4 participant">
				<div>
					<video className={vidClass + ' mx-auto'} ref={player} />
					<p 
						ref={nameTag}
						onClick={copy(id)} 
						className="z-10 px-3 py-1 mx-auto bg-black cursor-default transition duration-300 hover:opacity-100 opacity-80"
					>
						{(self && name) ? name : displayName}
					</p>
				</div>
			</div>
	)
}

export default ParticipantPlayer
