import { ITracksOnPlaylists } from './track.interface'
import { IUser } from './user.interface'

export interface IPlaylist {
	id: string
	name: string
	imageSrc: string
	user: IUser
	tracks: ITracksOnPlaylists[]
}

export interface ICreatePlaylist {
	name: string
	imageSrc?: string
}

export interface AddTrackToPlaylist {
	trackId: string
}

export type IUpdatePlaylist = Partial<Pick<IPlaylist, 'name' | 'imageSrc'>>
