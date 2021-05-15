import Peer from 'peerjs'
import {randID} from '@/util'

export const id = randID()
export const peer = new Peer(id)
