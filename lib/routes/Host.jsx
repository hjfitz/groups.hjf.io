import React from 'react'
import Peer from 'peerjs'

import {randID, useStream} from '../util'
import {PeerParticipant} from '../components'

const {useRef, useState, useEffect} = React

const Host = () => {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	const stream = useStream()
	// shoud follow form { id: $id, called: true/false }
	const [participants, setParticipants] = useState([])

	useEffect(() => {
		if (!stream) return

		// on webcam availability, we can now listen for connections
		peer.current.on('connection', (conn) => {
			const dial = peer.current.call(conn.peer, stream)
			console.log(`calling ${conn.peer}`)
			dial.on('stream', (peerStream) => {
				setParticipants(cur => {
					const newPeer = {id: conn.peer, stream: peerStream}
					const hasPeer = cur.some(ptp => ptp.id === conn.peer)
					if (hasPeer) return cur
					// spread don't push as react does a shallow check
					return [...cur, newPeer]
				})
			})
		})
	}, [stream])

	useEffect(() => {
		if (!participants.length) return
		participants.forEach((ptp) => {
			const conn = peer.current.connect(ptp.id)
			const listToShare = participants.filter(pp => pp.id !== ptp.id).map(pp => pp.id)
			conn.on('open', () => {
				conn.send(JSON.stringify({
					type: 'peer.list', 
					list: listToShare
				}))
			})
		})
	}, [participants])

	return (
		<section className="flex flex-wrap">
			{/* self */}
			<PeerParticipant self id={id.current} stream={stream} />

			{participants.map(participant => (
				<PeerParticipant
					key={participant.id} 
					{...participant} 
				/>
			))}
		</section>
	)
}

export default Host
