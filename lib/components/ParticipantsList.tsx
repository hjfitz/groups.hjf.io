import {ConnectedPeer} from '@/routes/types'
import {usePeer} from '@/util'
import React, {FC} from 'react'
import PeerParticipant from './PeerParticipant'

function getCols(pps: number) {
	if (pps === 1) return 1
	if (pps < 3) return 2
	if (pps < 6) return 3
	if (pps < 10) return 4
	if (pps < 13) return 5
	return 6
}

interface ListProps {
	participants: ConnectedPeer[]
	stream: MediaStream
}

const ParticipantsList: FC<ListProps> = ({participants, stream}) => {
	const {id} = usePeer()
	const cols = getCols(participants.length + 1)
	const className = `video-container grid-cols-${cols}`

	return (
		<>
			<section className={className}>
				<PeerParticipant id={id.current} stream={stream} />

				{participants.map((participant) => (
					<PeerParticipant
						key={participant.id} 
						{...participant} 
					/>
				))}
			</section>
		</>
	)
}

export default ParticipantsList
