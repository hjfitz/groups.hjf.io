import React, {FC} from 'react'
import {DataConnection} from 'peerjs'

import ParticipantsList from '@/components/ParticipantsList'
import {host as dispatchHost, selectName} from '@/state/slices/metadata'

import {
	HostPayload,
	SentPeerList,
	ParticipantProps,
	PatchedMediaStream,
} from '@/routes/types'
import {useAppDispatch, useAppSelector, useStream} from '@/state/hooks'
import {id, peer} from '@/state/globals'
import {selectParticipants, setParticipants as dispatchParticipants, SetParticipantsCallback} from '@/state/slices/peers'

const {
	useState,
	useEffect,
} = React

const Participant: FC<ParticipantProps> = (props: ParticipantProps) => {
	const dispatch = useAppDispatch()
	const name = useAppSelector(selectName)
	const stream = useStream()

	// call management
	const participants = useAppSelector(selectParticipants)

	const setParticipants = (callback: SetParticipantsCallback) => {
		dispatch(dispatchParticipants(callback))
	}
	// const {participants, setParticipants} = useParticipants()

	const [host, setHost] = useState<DataConnection>()

	useEffect(() => {
		if (!props.id) return
		dispatch(dispatchHost(props.id))
	}, [])

	/// /////////
	// CONNECT TO THOSE PEERS
	/// /////////
	useEffect(() => {
		if (!stream) return

		// once host connects to us, it will send all connected peers
		// loop through and call them. on call (useEffect on [host, stream]])
		// should have other peers call us: add their streams to state and render
		peer.on('connection', (conn) => {
			conn.on('data', (data) => {
				const payload = JSON.parse(data) as HostPayload
				if (payload.event === 'peer.list') {
					const peerListPayload = payload as SentPeerList
					peerListPayload.list.forEach(({id: peerID}) => {
						console.log(`calling ${id}`)
						peer.call(peerID, stream, {
							metadata: JSON.stringify({
								displayName: name ?? id,
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
		peer.on('call', (dial) => {
			// moshi moshi peer desu
			dial.answer(stream)

			dial.on('stream', (peerStream) => {
				setParticipants((activeConnections) => {
					const {displayName} = JSON.parse((dial as PatchedMediaStream).options.metadata)
					const hasPeer = activeConnections.some((conn) => conn.id === dial.peer)
					if (hasPeer) return activeConnections
					return [...activeConnections, {
						id: dial.peer,
						stream: peerStream,
						displayName: displayName || dial.peer,
					}]
				})
			})

			dial.on('close', () => {
				// cleanup: remove the peer once it disconnects
				// todo: if the host leaves, kill the session
				setParticipants((conns) => conns.filter((conn) => conn.id !== dial.peer))
			})
		})
	}, [stream, host])

	/// /////////
	// HOST CONNECTION
	/// /////////
	useEffect(() => {
		if (!stream || !props.id) return
		console.log('negotiating session with host', props.id)
		const conn = peer.connect(props.id)

		// tihs handshake is ok - but could be better
		// let peers handle calling host:
		// 1. peer calls a list.request event
		// 2. host sends list
		// 3. peer calls list -- this already happens
		// 4. host answers call
		conn.on('open', () => {
			conn.send(JSON.stringify({
				event: 'request.join',
				name: name ?? id,
			}))
		})

		// should notify the host of a new peer; host can then join
		setHost(conn)
	}, [stream])

	return <ParticipantsList participants={participants} />
}

export default Participant
