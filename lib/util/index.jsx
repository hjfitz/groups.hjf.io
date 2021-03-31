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
