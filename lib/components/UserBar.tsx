import {useLocation} from '@reach/router'
import React from 'react'

const {useState} = React

interface BarProps {
	stream?: MediaStream
}

const UserBar: React.FC<BarProps> = (props: BarProps) => {
	const location = useLocation()
	const allowedRoutes = ['/host', '/room']
	if (!allowedRoutes.some((route) => location.pathname.includes(route))) return <></>

	const [muted, setMute] = useState<boolean>(false)
	function toggleMute() {
		const {stream} = props
		if (!stream) return
		setMute((current) => {
			/* eslint-disable no-param-reassign */
			stream.getAudioTracks().forEach((track) => track.enabled = current)
			return !current
		})
	}

	let muteContent = <span className="mx-auto text-green-300">Speaking</span>
	if (muted) muteContent = <span className="mx-auto text-red-300">Muted</span>

	return (
		<div className="userbar">
			<section className="w-full h-full bg-black ">
				<div className="flex items-center h-full px-4">
					<div onClick={toggleMute} className="flex items-center w-24 h-full text-center cursor-pointer hover:bg-gray-800 transition duration-300">{muteContent}</div>
				</div>
			</section>
		</div>
	)
}

export default UserBar
