import {MediaConnection} from 'peerjs'


export interface RoutedComponent {
	path: string
}

export interface SentPeerList extends HostPayload {
	list: PeerDetails[]
}

export interface ParticipantProps extends RoutedComponent {
	id?: string
}

export interface HostPayload {
	event: string
}

export interface PeerListPayload extends HostPayload {
	id: string
	displayName: string
}

interface PeerDetails {
	id: string
	displayName: string
}

// todo: consolidate
export interface ConnectedPeer extends PeerDetails {
	stream: MediaStream 
}

export interface HostedPeer extends PeerDetails {
	stream: MediaStream
}


export interface PatchedMediaStream extends MediaConnection {
	options: {
		metadata: string
	}
}
