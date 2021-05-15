import React from 'react'
import {useLocation} from '@reach/router'
import ChatBox from '@/components/chat'
import {copy} from '@/util'
import {selectShareLink} from '@/state/slices/metadata'
import {useAppSelector} from '@/state/hooks'

const {useState} = React

interface BarProps {
	stream?: MediaStream
}

const UserBar = (props: BarProps) => {
	// hack but no other way to give multiple paths as a prop
	const location = useLocation()
	const allowedRoutes = ['/host', '/room']
	if (!allowedRoutes.some((route) => location.pathname.includes(route))) return <></>

	const url = useAppSelector(selectShareLink)

	const [showChat, setShowChat] = useState<boolean>(true)
	const toggleChat = () => setShowChat((cur) => !cur)

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
				<div className="flex items-center justify-between h-full px-4">
					<div
						onClick={toggleMute}
						className="flex items-center w-24 h-full text-center cursor-pointer hover:bg-gray-800 transition duration-300"
					>
						{muteContent}
					</div>
					{/* <div>
						<ChatBox show={showChat} />
						<span onClick={toggleChat} className="cursor-pointer">Show Chat</span>
					</div> */}
					<div>
						<span>Link to room: </span><span className="cursor-pointer" onClick={copy(url)}>{url}</span>
					</div>
				</div>
			</section>
		</div>
	)
}

export default UserBar
