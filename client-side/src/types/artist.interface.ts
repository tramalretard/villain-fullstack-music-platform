import { IAlbum } from './album.interface'
import { ITrack } from './track.interface'
import { IUser } from './user.interface'

export interface IArtist {
	id: string
	listener: number
	displayName: string
	bio?: string | null
	user: IUser
	imageSrc: string
	albums: IAlbum[]
	tracks: ITrack[]
}

export type ICreateArtistProfile = Pick<IArtist, 'displayName' | 'bio'>

export type IUpdateArtistProfile = Partial<Pick<IArtist, 'displayName' | 'bio'>>
