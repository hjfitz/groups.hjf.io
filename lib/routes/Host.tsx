import React, {FC} from 'react'
import {RouteComponentProps} from '@reach/router'

import {useDeveloperMode, usePlayer} from '@/util/hooks'
import {SentPeerList} from '@/routes/types'
import ParticipantsList from '@/components/ParticipantsList'
import {setHost, selectName} from '@/state/slices/metadata'
import {useAppDispatch, useAppSelector} from '@/state/hooks'

import {id, peer} from '@/state/globals'
import {
	selectParticipants,
	SetParticipantsCallback,
	setParticipants as dispatchSetParticipants,
} from '@/state/slices/peers'

const {useEffect} = React

const Host: FC<RouteComponentProps> = () => {
	const dispatch = useAppDispatch()
	const name = useAppSelector(selectName)

	const stream = usePlayer()

	// participant list has interface:
	// id, stream, displayName (defaults to id)
	const participants = useAppSelector(selectParticipants)
	const setParticipants = (cb: SetParticipantsCallback) => dispatch(dispatchSetParticipants(cb))

	useDeveloperMode(setParticipants)

	useEffect(() => {
		dispatch(setHost(id))
	}, [id])

	useEffect(() => {
		if (!participants.length) return

		console.log(`sending new participant list to peers: ${JSON.stringify(participants)}`)
		// when we change participants, let them know about the new list
		participants.forEach((ptp) => {
			const listToShare = participants
				.filter((pp) => pp.id !== ptp.id)
				.map(({id: pID, displayName}) => ({id: pID, displayName}))

			const conn = peer.connect(ptp.id)

			conn.on('open', () => {
				const sentList: SentPeerList = {
					event: 'peer.list',
					list: [
						...listToShare,
						// add self such that the participant can resolve our name
						{
							id,
							displayName: name ?? id,
						},
					],
				}

				conn.send(JSON.stringify(sentList))
			})
		})
	}, [participants])

	useEffect(() => {
		if (!stream) return
		// on request join, update peer list
		// that update should send list to peer
		// peer should call us
		// on call, update state with stream... which would not re call peers as ids are mapped in state

		// on webcam availability, we can now listen for connections
		peer.on('connection', (conn) => {
			// todo: remove this and set it from peerStream in onStream
			let peerName = conn.peer
			conn.on('data', (data) => {
				const payload = JSON.parse(data)
				if (payload.event === 'request.join') {
					if (payload.name) peerName = payload.name
					const dial = peer.call(conn.peer, stream, {
						metadata: JSON.stringify({displayName: name ?? id}),
					})
					console.log(`calling ${conn.peer}`)
					dial.on('stream', (peerStream) => {
						console.log({peerStream, dial})
						setParticipants((cur) => {
							const newPeer = {
								id: conn.peer,
								stream: peerStream,
								displayName: peerName,
							}

							const hasPeer = cur.some((ptp) => ptp.id === conn.peer)
							if (hasPeer) return cur
							// spread don't push as react does a shallow check
							return [...cur, newPeer]
						})
					})
				}
			})

			// cull peer from list
			conn.on('close', () => {
				// todo: remove participant via custom action (?)
				// setParticipants(
				// (curParticipants) => curParticipants.filter((participant) => participant.id !== conn.peer))
			})
		})
	}, [stream])

	return <ParticipantsList participants={participants} />
}

export default Host
