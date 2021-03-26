import React from 'react'
import Peer from 'peerjs'

import {PeerParticipant} from '../components'
import {useStream, randID, Stringify} from '../util'

const {useRef, useState, useEffect} = React

const Participant = (props) => {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	const vid = useRef(null)
	const stream = useStream()
	const [allPeers, setPeers] = useState([])
	const [host, setHost] = useState(null)

	useEffect(() => {
		if (!stream || !host) return
		// on mount
		peer.current.on('call', (dial) => {
			console.log(`incoming call from ${dial.peer}`)
			dial.on('stream', (peerStream) => {
				setPeers(peers => {
					const hasPeer = peers.some(ptp => ptp.id === dial.peer)
					if (hasPeer) return peers
					return [...peers, {id: dial.peer, stream: peerStream}]
				})
			})
			dial.answer(stream)
			// don't call dial.on('stream' and return the call
			// all peers dial (send video/audio) one another
		})
	}, [stream, host])

	// on streaming cam, connect to room
	useEffect(() => {
		if (!stream) return
		console.log('negotiating session with host', props.id)
		const conn = peer.current.connect(props.id) 

		// should notify the host of a new peer; host can then join
		setHost(conn)
	}, [stream])

	useEffect(() => {
		if (!stream) return
		peer.current.on('connection', (conn) => {
			conn.on('data', (data) => {
				// do something ot check the correspondence type -- at some point
				const {list} = JSON.parse(data)
				console.log({list})
				list.forEach(pr => {
					console.log({pr, stream})
					peer.current.call(pr, stream)
				})
			})
		})
	}, [stream])

	return (
		<section className="flex flex-wrap">
			<PeerParticipant self id={id.current} stream={stream} />
			{allPeers.map(peer => (
				<PeerParticipant
					key={peer.id} 
					{...peer} 
				/>
			))}
		</section>
	)
}

export default Participant
