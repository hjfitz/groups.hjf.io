// todo: handle the organisation better here
// we have context wrappers with the same names in ./index.jsx
// maybe move these hooks to lib/main.hooks.js
import React from 'react'
import Peer from 'peerjs'

import {randID} from './index'

const {useState, useRef, useEffect} = React

export function useStream() {
	const [stream, setStream] = useState(null)
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

// todo: extract in to hook and put in host and peer
export function usePeer() {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	return {peer, id}
}
