import React, {Dispatch, SetStateAction} from 'react'
import {ConnectedPeer} from '@/routes/types'

export interface ParticipantsCtx {
	participants: ConnectedPeer[]
	setParticipants: Dispatch<SetStateAction<ConnectedPeer[]>>
}

export const ParticipantsContext = React.createContext<ParticipantsCtx>({
	participants: [],
	setParticipants: () => {},
})
