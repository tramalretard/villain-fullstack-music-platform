import { ICreateAlbum, IUpdateAlbum } from './../types/album.interface'
import { axiosDefault, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'

class AlbumService {
	async getAlbumById(id: string) {
		const { data: album } = await axiosDefault({
			url: API_URL.albums.getById(id),
			method: 'GET',
		})

		return album
	}

	async createAlbum(data: ICreateAlbum) {
		const { data: album } = await axiosWithAuth({
			url: API_URL.albums.createAlbum(),
			method: 'POST',
			data,
		})

		return album
	}

	async updateAlbum(data: IUpdateAlbum, id: string) {
		const { data: album } = await axiosWithAuth({
			url: API_URL.albums.updateAlbum(id),
			method: 'PATCH',
			data,
		})

		return album
	}

	async deleteAlbum(id: string) {
		return await axiosWithAuth({
			url: API_URL.albums.deleteAlbum(id),
			method: 'DELETE',
		})
	}

	async updateImageAlbum(albumId: string, imageFile: File) {
		const formData = new FormData()
		formData.append('album-covers', imageFile)

		const { data: album } = await axiosWithAuth({
			url: API_URL.albums.updateImageAlbum(albumId),
			method: 'PATCH',
			data: formData,
		})

		return album
	}

	async markAlbumAsFavorite(albumId: string) {
		return await axiosWithAuth({
			url: API_URL.albums.markAlbumAsFavorite(albumId),
			method: 'POST',
		})
	}

	async getMyFavoriteAlbums() {
		const { data: albums } = await axiosWithAuth({
			url: API_URL.albums.getMyFavoriteAlbums(),
			method: 'GET',
		})

		return albums
	}

	async submitForPublication(albumId: string) {
		return await axiosWithAuth({
			url: API_URL.albums.submitForPublication(albumId),
			method: 'POST',
		})
	}
}
