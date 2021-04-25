// todo: handle the organisation better here
// we have context wrappers with the same names in ./index.jsx
// maybe move these hooks to lib/main.hooks.js
import React, {MutableRefObject} from 'react'
import Peer from 'peerjs'

import {randID} from '@/util'

const {useState, useRef, useEffect} = React

export function useStream() {
	const [stream, setStream] = useState<MediaStream>()
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

interface PeerDetails {
	peer: MutableRefObject<Peer>
	id: MutableRefObject<string>
}

// to be used by main - initialise the context
export function usePeer(): PeerDetails {
	const idInit = randID()
	const id = useRef(idInit)
	const peer = useRef(new Peer(idInit))
	return {peer, id}
}
