import React, {FC} from 'react'

import {PeerParticipant} from '@/components'
import {useDeveloperMode, useStream, usePeer} from '@/util'
import {AppContext} from '@/util/contexts'
import {RoutedComponent, Participant} from '@/routes/types'

const {useState, useEffect, useContext} = React

function getCols(pps: number) {
	if (pps < 3) return 2
	if (pps < 6) return 3
	if (pps < 10) return 4
	if (pps < 13) return 5
	return 6
}



const Host: FC<RoutedComponent> = () => {
	const {name} = useContext(AppContext)
	const {peer, id} = usePeer() 
	const stream = useStream()


	// participant list has interface:
	// id, stream, displayName (defaults to id)
	const [participants, setParticipants] = useState<Participant[]>([])

	useDeveloperMode(setParticipants)

	useEffect(() => {
		if (!participants.length) return

		console.log(`sending new participant list to peers: ${JSON.stringify(participants)}`)
		// when we change participants, let them know about the new list
		participants.forEach((ptp) => {
			if (!peer || !peer.current) return

			const listToShare = participants
				.filter(pp => pp.id !== ptp.id)
				.map(({id, displayName}) => ({id, displayName}))

			const conn = peer.current.connect(ptp.id)

			conn.on('open', () => {
				conn.send(JSON.stringify({
					event: 'peer.list', 
					list: [
						...listToShare, 
						// add self such that the participant can resolve our name
						{
							id: id.current, 
							displayName: name ?? id.current
						}
					],
				}))
				//conn.close()
			})
		})
	}, [participants])

	useEffect(() => {
		if (!stream || (!peer || !peer.current)) return
		// on request join, update peer list
		// that update should send list to peer
		// peer should call us
		// on call, update state with stream... which would not re call peers as ids are mapped in state


		// on webcam availability, we can now listen for connections
		peer.current.on('connection', (conn) => {

			// todo: remove this and set it from peerStream in onStream
			let peerName = conn.peer
			conn.on('data', data => {
				const payload = JSON.parse(data)
				if (payload.event === 'request.join') {
					peerName = payload.name
					const dial = peer.current.call(conn.peer, stream, {
						metadata: JSON.stringify({displayName: name ?? id.current})
					})
					console.log(`calling ${conn.peer}`)
					dial.on('stream', (peerStream) => {
						console.log({peerStream, dial})
						setParticipants((cur) => {
							const newPeer = {
								id: conn.peer, 
								stream: peerStream, 
								displayName: peerName
							}

							const hasPeer = cur.some(ptp => ptp.id === conn.peer)
							if (hasPeer) return cur
							// spread don't push as react does a shallow check
							return [...cur, newPeer]
						})
					})

				} 
			})

			// cull peer from list
			conn.on('close', () => {
				setParticipants((curParticipants) => 
					curParticipants.filter((participant) => participant.id !== conn.peer)
				)
			})

		})
		
	}, [stream])

	const cols = getCols(participants.length + 1)
	const className = `video-container grid-cols-${cols}`

	return (
		<>
			<section className={className}>
				<PeerParticipant id={id.current} stream={stream} />

				{participants.map(participant => (
					<PeerParticipant
						key={participant.id} 
						{...participant} 
					/>
				))}
			</section>
		</>
	)
}

export default Host
