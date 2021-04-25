import React from 'react'

import {
	StreamContext,
	PeerContext,
	StreamCtx,
	PeerCtx,
} from '@/util/contexts'

const {useEffect, useContext} = React

export const randID = () => Math.random().toString(36).substr(2, 10)

interface StringifyProps {
	json: object
}

export const Stringify: React.FC<StringifyProps> = ({json}: StringifyProps) => (
	<code>
		<pre>{JSON.stringify(json, null, 2)}</pre>
	</code>
)

export function useStream() {
	const {stream} = useContext(StreamContext) as StreamCtx
	return stream
}

export function usePeer() {
	const peerDetails = useContext(PeerContext) as PeerCtx
	return peerDetails
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

// shove an element on the page, copy the contents and remove
// because the event loop is clever, we don't see the element
// rendered
export function copy(id: string) {
	return () => {
		const rng = document.createRange()
		const el = document.createElement('div')
		el.textContent = id
		document.body.appendChild(el)
		rng.selectNode(el)
		const selection = window.getSelection()
		if (!selection) return
		selection.removeAllRanges()
		selection.addRange(rng)
		document.execCommand('copy')
		selection.removeAllRanges()
		document.body.removeChild(el)
	}
}
