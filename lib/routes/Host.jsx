import React from 'react'
import Peer from 'peerjs'

import {randID, useStream} from '../util'
import {PeerParticipant} from '../components'

const {useRef, useState, useEffect} = React

const Host = () => {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	const vid = useRef(null)
	const stream = useStream()
	// shoud follow form { id: $id, called: true/false }
	const [participants, setParticipants] = useState([])

	useEffect(() => {
		if (!stream) return
		peer.current.on('connection', (conn) => {
			const dial = peer.current.call(conn.peer, stream)
			console.log(`calling ${conn.peer}`)
			dial.on('stream', (peerStream) => {
				setParticipants(cur => {
					const newPeer = {id: conn.peer, stream: peerStream}
					const hasPeer = cur.some(ptp => ptp.id === conn.peer)
					if (hasPeer) return cur
					return [...cur, newPeer]
				})
			})
		})
	}, [stream])

	useEffect(() => {
		if (!participants.length) return
		participants.forEach((ptp) => {
			const conn = peer.current.connect(ptp.id)
			conn.on('open', () => {
				conn.send(JSON.stringify({
					type: 'peers', 
					list: participants
						.filter(pp => pp.id !== ptp.id)
						.map(pp => pp.id)
				}))
			})
		})
	}, [participants])

	return (
		<main className="h-full text-white bg-gray-900">
			<section className="flex">
				{/* self */}
				<PeerParticipant id={id.current} stream={stream} />

				{participants.map(participant => (
					<PeerParticipant
						key={participant.id} 
						{...participant} 
					/>
				))}
			</section>
		</main>
	)
}

export default Host
