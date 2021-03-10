import * as React from 'react'
import {render} from 'react-dom'
import Peer from 'peerjs'
import {Router, Link, navigate} from '@reach/router'

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
		<div className="relative">
			<p className="absolute bottom-0 left-0 opacity-80 z-10">peer: {id}</p>
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
		<main className="bg-gray-900 text-white h-full">
			<section className="flex">
				<div className="m-4 relative">
					<p className="bg-black absolute z-10 bottom-0 py-1 px-4 opacity-80">{id.current}</p>
					<video className="self" muted ref={vid} />
				</div>
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
			// don't call dial.on('stream' and return the call, we handle this
			// with some distributed magic
		})
	}, [stream, host])

	// on streaming cam
	useEffect(() => {
		if (!stream) return
		vid.current.srcObject = stream
		vid.current.play()
		const {id} = props
		console.log('negotiating session with host', id)
		const conn = peer.current.connect(id) 
		// should notify the host of a new peer; host can then join
		setHost(conn)
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

	return (
		<main>
			<section>
				<p>debug</p>
				<p>your id {id.current}</p>
				<p>connected: {(!!host).toString()}</p>
				<p>All peers: <Stringify json={allPeers.map(peer => peer.id)} /></p>
			</section>

			<section>
				<h2>you</h2>
				<video muted ref={vid} />
			</section>
			<section>
				<h2>them</h2>
				{allPeers.map(peer => (
					<ParticipantPlayer
						key={peer.id} 
						{...peer} 
					/>
				))}
			</section>
		</main>
	)
}

const Home = () => (
	<main className="bg-gray-900 text-white flex flex-col h-full justify-center items-center">
		<h1 className="text-3xl">Are you hosting or joining?</h1>
		<div className="flex text-center mt-2">
			<Link className="btn" to="/host">Hosting</Link>
			<Link className="btn" to="/join">Joining</Link>
		</div>
	</main>
)

const Connector = () => {
	const input = useRef(null)

	const keyNav = ({key}) => {
		if (key === 'Enter') nav()
	}

	const nav = () => {
		const {value} = input.current
		navigate(`/room/${value}`)
	}

	return (
		<main className="bg-gray-900 text-white h-full flex flex-col items-center justify-center">
			<div className="w-64">
				<input className="w-full mb-2 text-black rounded p-2" ref={input} onKeyUp={keyNav} placeholder="Enter the Peer ID here" />
			</div>
			<p onClick={nav} className="btn text-center">Connect</p>
		</main>
	)
}



////// 		//
// main app //
///// 		//
const App = () => (
	<Router className="h-full">
		<Home path="/" />
		<Host path="/host" />
		<Connector path="/join" />
		<Participant path="/room/:id" />
	</Router>
)


render(<App />, entry)
