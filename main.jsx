import * as React from 'react'
import {render} from 'react-dom'
import Peer from 'peerjs'

const entry = document.getElementById('main')
// hack to get hooks working with snowpack
const {useState, useRef, useEffect} = React

const randID = () => Math.random().toString(36).substr(2, 10)

const Stringify = ({json}) => <code><pre>{JSON.stringify(json, null, 2)}</pre></code>

function useStream() {
	const [stream, setStream] = useState(null)
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

const ParticipantPlayer = ({id, stream}) => {
	const player = useRef(null)
	useEffect(() => {
		player.current.srcObject = stream
		player.current.play()
	}, [])

	return (
		<div>
			<p>peer: {id}</p>
			<video ref={player} />
		</div>
	)
}

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
		vid.current.srcObject = stream
		vid.current.play()
	}, [stream])


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
		<main>
			<section>
				<p>debug</p>
				<p>id: {id.current}</p>
				<p>participants: <Stringify json={participants} /></p>
			</section>
			<section>
				<h2>you</h2>
				<video muted ref={vid} />
			</section>
			<section>
				<h2>peers</h2>
				{/* some map happens here? */}
				{participants.map(participant => (
					<ParticipantPlayer 
						key={participant.id} 
						{...participant} 
					/>
				))}
			</section>
		</main>
	)
}

const ParticipantPeer = ({id, stream, peer}) => {
	const vid = useRef(null)

	// if no stream, dial and get a response
	useEffect(() => {
		vid.current.srcObject = stream 
		vid.current.play()
	}, [])

	return (
		<div>
			<p>peer {id}</p>
			<video ref={vid} />
		</div>
	)
}

const Participant = () => {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	const vid = useRef(null)
	const stream = useStream()
	const [allPeers, setPeers] = useState([])
	const [streams, setStreams] = useState([])
	const [host, setHost] = useState(null)
	const [isConnected, setConnected] = useState(false)

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
			// don't call dial.on('stream' and return the call, we handle this
			// with some distributed magic
		})
	}, [stream, host])

	// on streaming cam
	useEffect(() => {
		if (!stream) return
		vid.current.srcObject = stream
		vid.current.play()
	}, [stream])

	useEffect(() => {
		if (!stream) return
		peer.current.on('connection', (conn) => {
			conn.on('data', (data) => {
				const {list} = JSON.parse(data)
				console.log({list})
				list.forEach(pr => {
					console.log({pr, stream})
					peer.current.call(pr, stream)
				})
			})
		})
	}, [stream])

	useEffect(() => {
		console.log(allPeers)
	}, [allPeers])

	const tryJoin = (ev) => {
		if (ev.key !== 'Enter') return
		const {value: id} = ev.target
		console.log('negotiating session with host', id)
		const conn = peer.current.connect(id) 
		// should notify the host of a new peer; host can then join
		setHost(conn)
	}


	return (
		<main>
			<section>
				<p>debug</p>
				<p>your id {id.current}</p>
				<p>connected: {(!!host).toString()}</p>
				<p>All peers: <Stringify json={allPeers.map(peer => peer.id)} /></p>
			</section>
			<section>
				<h1>join a room</h1>
				<label>
					room id:
					<input onKeyUp={tryJoin} />
				</label>
			</section>

			<section>
				<h2>you</h2>
				<video muted ref={vid} />
			</section>
			<section>
				<h2>them</h2>
				{allPeers.map(peer => (
					<ParticipantPeer 
						peer={peer}
						key={peer.id} 
						{...peer} 
					/>
				))}
			</section>
		</main>
	)
}

////// 		//
// main app //
///// 		//
const App = () => {
	const HOST = 'host'
	const PARTICIPANT = 'participant'
	const [peerType, setPeerType] = useState(null)
	const setType = (type) => () => setPeerType(type)

	if (!peerType) {
		return (
			<main>
				<h1>Are you hosting or joining?</h1>
				<p onClick={setType(HOST)}>Host</p>
				<p onClick={setType(PARTICIPANT)}>Joining</p>
			</main>
		)
	} else if (peerType === HOST) {
		return <Host />
	} else if (peerType === PARTICIPANT) {
		return <Participant />
	}
}

render(<App />, entry)
