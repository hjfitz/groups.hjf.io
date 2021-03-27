import React from 'react'
import Peer from 'peerjs'

import {randID, useStream} from '../util'
import {PeerParticipant} from '../components'
import {AppContext} from '../main'

const {useRef, useState, useEffect, useContext} = React

const Host = () => {
	const {name} = useContext(AppContext)
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	const stream = useStream()

	// participant list has interface:
	// id, stream, displayName (defaults to id)
	const [participants, setParticipants] = useState([])

	useEffect(() => {
		if (!participants.length) return

		console.log('sending new participant list to peers')
		console.log({participants})
		// when we change participants, let them know about the new list
		participants.forEach((ptp) => {

			const conn = peer.current.connect(ptp.id)
			const listToShare = participants
				.filter(pp => pp.id !== ptp.id)
				.map(({id, displayName}) => ({id, displayName}))

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
		if (!stream) return

		// on webcam availability, we can now listen for connections
		peer.current.on('connection', (conn) => {
			

			let peerName = conn.peer
			conn.on('data', data => {
				const payload = JSON.parse(data)
				if (payload.event === 'name.set') {
					peerName = payload.name
					const dial = peer.current.call(conn.peer, stream)
					console.log(`calling ${conn.peer}`)
					dial.on('stream', (peerStream) => {
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
