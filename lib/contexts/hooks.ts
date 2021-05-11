import {useContext, useEffect, useState} from 'react'

import {
	StreamContext,
	PeerContext,
	ParticipantsContext,
	StreamCtx,
	AppContext,
	PeerCtx,
	AppCtx,
} from '@/contexts/providers'

export function useStream() {
	const {stream} = useContext(StreamContext) as StreamCtx
	return stream
}

export function usePeer() {
	const peer = useContext(PeerContext) as PeerCtx
	return peer
}

export function useParticipants() {
	return useContext(ParticipantsContext)
}

export function useApp() {
	const [url, setUrl] = useState<string>('')
	const app = useContext(AppContext) as AppCtx

	useEffect(() => {
		const {origin} = window.location
		const newUrl = `${origin}/room/${app.host}`
		setUrl(newUrl)
	}, [app.host])

	return {...app, url}
}

export function useDeveloperMode(setList: Function) {
	const stream = useStream()
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
