import { IAlbum } from './album.interface'
import { IArtist } from './artist.interface'
import { IPlaylist } from './playlist.interface'
import { IContentStatus } from './status.interface'

export interface ITrack {
	id: string
	name: string
	duration: number
	audioSrc: string
	imageSrc: string
	listener: number
	isExplicit?: boolean
	artist: IArtist
	album: IAlbum | null
	albumId?: string | null
	playlists: ITracksOnPlaylists[]
	status: IContentStatus
}

export interface ITracksOnPlaylists {
	playlist: IPlaylist
	track: ITrack
	addedAt: string
}

export interface ICreateTrack {
	name: string
	imageSrc: string
	isExplicit?: boolean
	albumId?: string
}

export type IUpdateTrack = Partial<
	Pick<ITrack, 'name' | 'imageSrc' | 'isExplicit' | 'albumId'>
>
