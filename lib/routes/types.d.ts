import {RouteComponentProps} from '@reach/router'
import {MediaConnection} from 'peerjs'

export interface SentPeerList extends HostPayload {
	list: PeerDetails[]
}

export interface ParticipantProps extends RouteComponentProps {
	id?: string
}

interface PeerDetails {
	id: string
	displayName: string
}

// todo: consolidate
export interface ConnectedPeer extends PeerDetails {
	stream: MediaStream
}

export interface PatchedMediaStream extends MediaConnection {
	options: {
		metadata: string
	}
}

/// ///////////////////
// DataConnection payloads
/// ///////////////////

export interface HostPayload {
	event: string
}

export interface PeerListPayload extends HostPayload {
	id: string
	displayName: string
}

export interface MessagePayload extends HostPayload {
	who: string
	message: string
}
