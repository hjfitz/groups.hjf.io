import React from 'react'

export const randID = () => Math.random().toString(36).substr(2, 10)

interface StringifyProps {
	json: object
}

export const Stringify: React.FC<StringifyProps> = ({json}: StringifyProps) => (
	<code>
		<pre>{JSON.stringify(json, null, 2)}</pre>
	</code>
)

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
