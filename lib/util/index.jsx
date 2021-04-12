import React from 'react'

import {StreamContext, PeerContext} from './contexts'

const {useEffect, useState, useContext} = React

export const randID = () => Math.random().toString(36).substr(2, 10)

export const Stringify = ({json}) => (
	<code>
		<pre>{JSON.stringify(json, null, 2)}</pre>
	</code>
)

export function useStream() {
	const {stream} = useContext(StreamContext)
	return stream
}

export function usePeer() {
	const peerDetails = useContext(PeerContext)
	return peerDetails
}

export function useDeveloperMode(setList) {
	const stream = useStream()
	useEffect(() => {
		if (!stream) return
		const url = new URLSearchParams(window.location.search)
		const vidNum = url.get('v')
		if (!vidNum) return
		// both states (host and reg) follow the same interface
		// id, stream, displayName
		setList((cur) => {
			const fakeStreams = Array.from({length: vidNum}, () => {
				return {
					id: '__DeveloperInitiated_NODIAL',
					displayName: '__DeveloperPeer',
					stream,
				}
			})
			return [...cur, ...fakeStreams]
		})
	}, [stream])
}

// shove an element on the page, copy the contents and remove
// because the event loop is clever, we don't see the element 
// rendered
export function copy(id) {
	return function() {
		const rng = document.createRange()
		const el = document.createElement('div')
		el.textContent = id
		document.body.appendChild(el)
		rng.selectNode(el)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(rng)
		document.execCommand('copy')
		window.getSelection().removeAllRanges()
		document.body.removeChild(el)
	}
}
