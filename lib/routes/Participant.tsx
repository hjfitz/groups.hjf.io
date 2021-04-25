import React, {FC} from 'react'
import {DataConnection} from 'peerjs'

import ParticipantsList from '@/components/ParticipantsList'
import {useStream, usePeer} from '@/util'
import {AppContext} from '@/util/contexts'
import {
	HostPayload,
	SentPeerList,
	ConnectedPeer,
	ParticipantProps,
	PatchedMediaStream,
} from '@/routes/types'

const {
	useState,
	useEffect,
	useContext,
} = React

const Participant: FC<ParticipantProps> = (props: ParticipantProps) => {
	const {peer, id} = usePeer()
	const {name} = useContext(AppContext)
	const stream = useStream()

	// call management
	const [peerConnections, setPeerConnections] = useState<ConnectedPeer[]>([])

	const [host, setHost] = useState<DataConnection>()

	/// /////////
	// CONNECT TO THOSE PEERS
	/// /////////
	useEffect(() => {
		if (!stream) return

		// once host connects to us, it will send all connected peers
		// loop through and call them. on call (useEffect on [host, stream]])
		// should have other peers call us: add their streams to state and render
		peer.current.on('connection', (conn) => {
			conn.on('data', (data) => {
				const payload = JSON.parse(data) as HostPayload
				if (payload.event === 'peer.list') {
					const peerListPayload = payload as SentPeerList
					peerListPayload.list.forEach(({id: peerID}) => {
						console.log(`calling ${id}`)
						peer.current.call(peerID, stream, {
							metadata: JSON.stringify({
								displayName: name ?? id.current,
								event: 'peer.call',
							}),
						})
					})
				}
			})
		})
	}, [stream])

	/// /////////
	// PEER CONNECTS TO US
	/// /////////
	useEffect(() => {
		// only handle calls when we can hook in to the cam
		// and chat with the host
		if (!stream || !host) return

		// calls in foreach are handled here
		peer.current.on('call', (dial) => {
			// moshi moshi peer desu
			dial.answer(stream)

			dial.on('stream', (peerStream) => {
				setPeerConnections((activeConnections) => {
					const {displayName} = JSON.parse((dial as PatchedMediaStream).options.metadata)
					const hasPeer = activeConnections.some((conn) => conn.id === dial.peer)
					if (hasPeer) return activeConnections
					return [...activeConnections, {
						id: dial.peer,
						stream: peerStream,
						displayName,
					}]
				})
			})

			dial.on('close', () => {
				// cleanup: remove the peer once it disconnects
				// todo: if the host leaves, kill the session
				setPeerConnections((conns) => conns.filter((conn) => conn.id !== dial.peer))
			})
		})
	}, [stream, host])

	/// /////////
	// HOST CONNECTION
	/// /////////
	useEffect(() => {
		if (!stream || !props.id) return
		console.log('negotiating session with host', props.id)
		const conn = peer.current.connect(props.id)

		// tihs handshake is ok - but could be better
		// let peers handle calling host:
		// 1. peer calls a list.request event
		// 2. host sends list
		// 3. peer calls list -- this already happens
		// 4. host answers call
		conn.on('open', () => {
			conn.send(JSON.stringify({
				event: 'request.join',
				name: name ?? id.current,
			}))
		})

		// should notify the host of a new peer; host can then join
		setHost(conn)
	}, [stream])

	return <ParticipantsList participants={peerConnections} />
}

export default Participant
