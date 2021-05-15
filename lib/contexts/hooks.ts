import {useContext, useEffect} from 'react'

import {
	PeerContext,
	ParticipantsContext,
	PeerCtx,
} from '@/contexts/providers'
import {useAppSelector} from '@/state/hooks'
import {selectStream} from '@/state/slices/peer'

export function usePeer() {
	const peer = useContext(PeerContext) as PeerCtx
	return peer
}

export function useParticipants() {
	return useContext(ParticipantsContext)
}

export function useDeveloperMode(setList: Function) {
	const stream = useAppSelector(selectStream)
	useEffect(() => {
		if (!stream) return
		const url = new URLSearchParams(window.location.search)
		const vidNumRaw = url.get('v')
		const vidNum = parseInt(vidNumRaw ?? '4', 10)

		if (!vidNumRaw || !Number.isInteger(vidNum)) return
		// both states (host and reg) follow the same interface
		// id, stream, displayName
		// todo - type states better
		setList((cur: Array<any>) => {
			const fakeStreams = Array.from({length: vidNum}, () => ({
				id: '__DeveloperInitiated_NODIAL',
				displayName: '__DeveloperPeer',
				stream,
			}))
			return [...cur, ...fakeStreams]
		})
	}, [stream])
}
