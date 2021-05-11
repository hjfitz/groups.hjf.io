import {HostPayload, MessagePayload} from '@/routes/types'
import {useApp, usePeer} from '@/contexts/hooks'
import {DataConnection} from 'peerjs'
import React, {useEffect, useState} from 'react'

interface ChatProps {
	show: boolean
}

interface MessageIn {
	who: string
	message: string
}

const ChatIn: React.FC = () => {
	const {peer} = usePeer()
	const {host} = useApp()
	function handleInput(ev) {
		if (ev.key !== 'Enter') return
		console.log(ev.target.value)
		// emit to host
	}
	return (
		<input
			className="px-2 bg-gray-800 rounded"
			onKeyUp={handleInput}
		/>
	)
}

const Message = ({who, message}: MessageIn) => (
	<div>
		<span>{who}: </span>
		<span>{message}</span>
	</div>
)

// temp dev
const defaultState: MessageIn[] = [
	{who: 'harry', message: 'hey'},
	{who: 'george', message: 'hey'},
	{who: 'harry', message: 'how are you'},
	{who: 'george', message: 'yea good'},
	{who: 'george', message: 'you??'},
]

const ChatBox: React.FC<ChatProps> = ({show}: ChatProps) => {
	const [messages, setMessages] = useState<MessageIn[]>(defaultState)
	const {peer} = usePeer()
	useEffect(() => {
		if (!peer) return
		// do stuff
		peer.current.on('connection', (conn: DataConnection) => {
			conn.on('data', (data) => {
				const payload = JSON.parse(data) as HostPayload
				if (payload.event !== 'message.send') return
				const messagePayload = payload as MessagePayload
				setMessages((mgs) => [
					...mgs,
					{who: messagePayload.who, message: messagePayload.message},
				])
			})
		})
	}, [peer])
	let displayClass = 'block'
	if (!show) displayClass = 'hidden'
	return (
		<section className={`relative ${displayClass}`}>
			<div className="absolute bottom-0 flex flex-col justify-end h-64 p-4">
				{messages.map((message) => <Message {...message} />)}
				<ChatIn />
			</div>
		</section>
	)
}

export default ChatBox
