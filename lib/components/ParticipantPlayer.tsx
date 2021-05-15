import React from 'react'

import {copy} from '@/util'
import {usePeer} from '@/contexts/hooks'
import {useAppSelector} from '@/state/hooks'
import {selectName} from '@/state/slices/metadata'

const {useRef, useEffect} = React

interface PlayerProps {
	id: string
	displayName?: string
	stream?: MediaStream
}

const ParticipantPlayer: React.FC<PlayerProps> = ({id, displayName, stream}: PlayerProps) => {
	let dispName = displayName
	// const {name} = useContext(AppContext) as AppCtx
	const name = useAppSelector(selectName)

	const {id: selfID} = usePeer()
	const self = id === selfID.current
	if (!displayName && !name) {
		dispName = id
	}
	const player = useRef<HTMLVideoElement>(null)
	const nameTag = useRef<HTMLParagraphElement>(null)
	const vidClass = self ? 'self' : ''

	// need to re-play state if we get a new stream
	useEffect(() => {
		if (!player || !player.current || !stream) return
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
				<video
					disablePictureInPicture
					controlsList="nodownload"
					className={`${vidClass} mx-auto`}
					ref={player}
					muted={self}
				/>
				<p
					ref={nameTag}
					onClick={copy(id)}
					className="z-10 px-3 py-1 mx-auto bg-black cursor-default transition duration-300 hover:opacity-100 opacity-80"
				>
					{(self && name) ? name : dispName}
				</p>
			</div>
		</div>
	)
}

ParticipantPlayer.defaultProps = {
	displayName: undefined,
}

export default ParticipantPlayer
