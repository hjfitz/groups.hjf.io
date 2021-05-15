import {ConnectedPeer} from '@/routes/types'

import {Action} from '@/state/types'

export const setName = (name: string) => ({
	type: Action.Name,
	payload: name,
})

export const setHost = (host: string) => ({
	type: Action.Host,
	payload: host,
})

export const addParticipants = (participant: ConnectedPeer) => ({
	type: Action.NewParticipant,
	payload: participant,
})
