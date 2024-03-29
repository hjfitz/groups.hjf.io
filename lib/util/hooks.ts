import {useState, useEffect, useContext} from 'react'

import {StreamContext} from '@/state/contexts'

export function useStream() {
	const [stream, setStream] = useState<MediaStream>()
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

export const usePlayer = () => useContext(StreamContext)

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
