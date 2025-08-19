import { IAlbum } from './album.interface'
import { IArtist } from './artist.interface'
import { IPlaylist } from './playlist.interface'

export interface IUser {
	id: string
	name: string
	email: string
	password?: string
	playlists: IPlaylist[]
	artistProfile?: IArtist | null
	favoriteAlbums: IAlbum[]
	avatar: string
}
