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

	// peer management
	const [allPeers, setPeers] = useState([])
	// use this to map names to peers (above)
	const [peerList, setPeerList] = useState([])
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

	// handle connecting to peers
	useEffect(() => {
		if (!stream) return
		peer.current.on('connection', (conn) => {
			conn.on('data', (data) => {
				const payload = JSON.parse(data)
				if (payload.event === 'peer.list') {
					payload.list.forEach(({id}) => {
						peer.current.call(id, stream)
					})
					setPeerList(payload.list)
				}
			})
		})
	}, [stream])

	function resolvePeerNames() {
		const resolvedPeers = allPeers.map(peer => {
			const peerWithName = peerList.find(pp => pp.id === peer.id)
			// rename peerwithname lol
			peer.displayName = peerWithName?.displayName ?? peer.id
			return peer
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
