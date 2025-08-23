import { axiosDefault, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'
import {
	ICreatePlaylist,
	IPlaylist,
	IUpdatePlaylist,
} from '@/types/playlist.interface'

class PlaylistService {
	async getPlaylistById(id: string) {
		const { data: playlist } = await axiosDefault({
			url: API_URL.playlists.getById(id),
			method: 'GET',
		})

		return playlist
	}

	async getMyPlaylists() {
		const { data: playlists } = await axiosWithAuth({
			url: API_URL.playlists.getMyPlaylists(),
			method: 'GET',
		})

		return playlists
	}

	async createPlaylist(data: ICreatePlaylist) {
		const { data: playlist } = await axiosWithAuth({
			url: API_URL.playlists.createPlaylist(),
			method: 'POST',
			data,
		})

		return playlist
	}

	async deletePlaylist(id: string) {
		return await axiosWithAuth({
			url: API_URL.playlists.deletePlaylist(id),
			method: 'DELETE',
		})
	}

	async updatePlaylist(id: string, data: IUpdatePlaylist) {
		return await axiosWithAuth({
			url: API_URL.playlists.updatePlaylist(id),
			method: 'PATCH',
			data,
		})
	}

	async addTrackToMarked(trackId: string) {
		return await axiosWithAuth({
			url: API_URL.playlists.addTrackToMarked(),
			method: 'POST',
			data: { trackId },
		})
	}

	async removeTrackFromMarked(trackId: string) {
		return await axiosWithAuth({
			url: API_URL.playlists.removeTrackFromMarked(),
			method: 'DELETE',
			data: { trackId },
		})
	}

	async addTrackToPlaylist(playlistId: string, trackId: string) {
		return await axiosWithAuth({
			url: API_URL.playlists.addTrackToPlaylist(playlistId),
			method: 'PATCH',
			data: { trackId },
		})
	}

	async removeTrackFromPlaylist(playlistId: string, trackId: string) {
		return await axiosWithAuth({
			url: API_URL.playlists.removeTrackFromPlaylist(playlistId),
			method: 'PATCH',
			data: { trackId },
		})
	}
}

export const playlistService = new PlaylistService()
