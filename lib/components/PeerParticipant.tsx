import React from 'react'

import {copy, usePeer} from '@/util'
import {AppContext, AppCtx, PeerCtx} from '@/util/contexts'

const {useRef, useEffect, useState, useContext} = React

interface BarProps {
	stream?: MediaStream
}

interface PlayerProps {
	id: string
	displayName?: string
	stream: MediaStream
}

export const UserBar: React.FC<BarProps> = ({stream}) => {
	const [muted, setMute] = useState<boolean>(false)
	function toggleMute() {
		if (!stream) return
		setMute((current) => {
			stream.getAudioTracks().forEach(track => track.enabled = current)
			return !current
		})
	}
	return (
		<div>
			<section className="fixed bottom-0 z-20 w-full bg-black ">
				<div className="flex px-4 py-4">
					<div onClick={toggleMute} className="cursor-pointer">Muted: {muted.toString()}</div>
				</div>
			</section>
		</div>
	)
}

const ParticipantPlayer: React.FC<PlayerProps> = ({id, displayName, stream}) => {
	const {name} = useContext(AppContext) as AppCtx
	const {id: selfID} = usePeer() as PeerCtx
	const self = id === selfID.current
	if (!displayName && !name) {
		displayName = id
	}
	const player = useRef<HTMLVideoElement>(null)
	const vidClass = self ? 'self' : ''

	// need to re-play state if we get a new stream
	useEffect(() => {
		if (!player || !player.current) return
		player.current.srcObject = stream
		player.current.play()
	}, [stream])


	return (
		<div>
			<div className="relative flex-col-reverse flex-auto h-full m-4 participant justify-items-center">
				<p 
					onClick={copy(id)} 
					className="absolute bottom-0 left-0 z-10 px-3 py-1 bg-black cursor-default transition duration-300 hover:opacity-100 opacity-80"
				>
					{(self && name) ? name : displayName}
				</p>
				<video className={vidClass + ' h-full'} ref={player} />
			</div>
		</div>
	)
}

export default ParticipantPlayer
