import { axiosDefault, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'
import { ITrack, IUpdateTrack } from '@/types/track.interface'

class TrackService {
	async getTrackById(id: string) {
		const { data: track } = await axiosDefault({
			url: API_URL.tracks.getById(id),
			method: 'GET',
		})

		return track
	}

	async createTrack(data: ITrack, audioFile: File) {
		const formData = new FormData()
		formData.append('audio', audioFile)

		formData.append('name', data.name)
		if (data.isExplicit !== undefined) {
			formData.append('isExplicit', String(data.isExplicit))
		}

		if (data.albumId) {
			formData.append('albumId', data.albumId)
		}

		const { data: track } = await axiosWithAuth({
			url: API_URL.tracks.artists.addTrack(),
			method: 'POST',
			data: formData,
		})

		return track
	}

	async updateTrack(data: IUpdateTrack, id: string) {
		const { data: track } = await axiosWithAuth({
			url: API_URL.tracks.artists.updateTrack(id),
			method: 'PATCH',
			data,
		})

		return track
	}

	async deleteTrack(id: string) {
		return await axiosWithAuth({
			url: API_URL.tracks.artists.deleteTrack(id),
			method: 'DELETE',
		})
	}

	async incrementListenCount(id: string) {
		return await axiosDefault({
			url: API_URL.tracks.listenTrack(id),
			method: 'POST',
		})
	}

	async markTrackAsFavorite(id: string) {
		return await axiosWithAuth({
			url: API_URL.tracks.markTrackAsFavorite(id),
			method: 'POST',
		})
	}

	async updateImage(id: string, imageFile: string) {
		const formData = new FormData()
		formData.append('track-covers', imageFile)

		return await axiosWithAuth({
			url: API_URL.tracks.artists.updateImageTrack(id),
			method: 'PATCH',
			data: formData,
		})
	}

	async submitForPublication(id: string) {
		return await axiosWithAuth({
			url: API_URL.tracks.artists.submitForPublication(id),
			method: 'POST',
		})
	}

	async assignTrackToAlbum(trackId: string, albumId: string) {
		return await axiosWithAuth({
			url: API_URL.tracks.artists.assignTrackToAlbum(trackId, albumId),
			method: 'PATCH',
		})
	}
}

export const trackService = new TrackService()
