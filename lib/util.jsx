import React from 'react'

const {useEffect, useState} = React

export const randID = () => Math.random().toString(36).substr(2, 10)

export const Stringify = ({json}) => <code><pre>{JSON.stringify(json, null, 2)}</pre></code>

export function useStream() {
	const [stream, setStream] = useState(null)
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(setStream)
	}, [])
	return stream
}

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
