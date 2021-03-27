import React from 'react'
import Peer from 'peerjs'

import {PeerParticipant} from '../components'
import {useStream, randID} from '../util'
import {AppContext} from '../main'

const {
	useRef,
	useState, 
	useEffect, 
	useContext,
} = React

const Participant = (props) => {
	// peer bits
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))

	// custom hooks and bits
	const {name} = useContext(AppContext)
	const stream = useStream()

	// call management
	const [peerConnections, setPeerConnections] = useState([])

	// use this to map names to peers (above)
	const [peerNameMap, setNameMap] = useState([])

	const [host, setHost] = useState(null)

	////////////
	// CONNECT TO THOSE PEERS
	////////////
	useEffect(() => {
		if (!stream) return
		peer.current.on('connection', (conn) => {
			conn.on('data', (data) => {
				const payload = JSON.parse(data)
				if (payload.event === 'peer.list') {
					console.log('new peer list get', {payload})
					payload.list.forEach(({id}) => {
						peer.current.call(id, stream)
					})
					setNameMap(payload.list)
				}
			})
		})
	}, [stream])

	////////////
	// PEER CONNECTS TO US
	////////////
	useEffect(() => {
		// only handle calls when we can hook in to the cam
		// and chat with the host
		if (!stream || !host) return
		// on mount
		peer.current.on('call', (dial) => {

			dial.answer(stream)
			// don't call dial.on('stream' and return the call
			// all peers dial (send video/audio) one another

			dial.on('stream', (peerStream) => {
				setPeerConnections((activeConnections) => {
					const hasPeer = activeConnections.some(conn => conn.id === dial.peer)
					if (hasPeer) return activeConnections 
					return [...activeConnections, {id: dial.peer, stream: peerStream}]
				})
			})

			dial.on('close', () => {
				// perform cleanup with setPeerConnections and peers 
				// ideally we could consolidate peers and peerConnections but race conditions prohibit this
				// thus we maintain two arrays
				// todo: name these better
				setPeerConnections((conns) => {
					return conns.filter((conn) => conn.id !== dial.peer)
				})
			})
		})
	}, [stream, host])

	////////////
	// HOST CONNECTION
	////////////
	useEffect(() => {
		if (!stream) return
		console.log('negotiating session with host', props.id)
		const conn = peer.current.connect(props.id) 

		conn.on('open', () => {
			conn.send(JSON.stringify({
				event: 'name.set',
				name: name ?? id.current,
			}))
		})

		// should notify the host of a new peer; host can then join
		setHost(conn)
	}, [stream])



	function resolvePeerNames() {
		const resolvedPeers = peerConnections 
		// filter as peerNameMap is maintained by our source of truth - host
			.filter(peer => peerNameMap.find(pp => pp.id === peer.id))
			.map((peer) => {
				const namedPeer = peerNameMap.find(pp => pp.id === peer.id)
				const displayName = namedPeer.displayName ?? peer.id
				return {...peer, displayName}
			})
		return resolvedPeers
	}

	return (
		<section className="flex flex-wrap">
			<PeerParticipant self id={id.current} stream={stream} />
			{resolvePeerNames().map(peer => (
				<PeerParticipant
					key={peer.id} 
					{...peer} 
				/>
			))}
		</section>
	)
}

export default Participant
