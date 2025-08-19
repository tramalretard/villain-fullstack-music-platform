import { IArtist } from './artist.interface'
import { IContentStatus } from './status.interface'
import { ITrack } from './track.interface'
import { IUser } from './user.interface'

export interface IAlbum {
	id: string
	name: string
	imageSrc: string
	isExplicit: boolean
	listener: number
	artist: IArtist
	favoritedBy: IUser[]
	tracks: ITrack[]
	status: IContentStatus
}

export type ICreateAlbum = Pick<IAlbum, 'name' | 'isExplicit'>

export type IUpdateAlbum = Partial<Pick<IAlbum, 'name' | 'isExplicit'>>
