import { axiosDefault, axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'
import { IUpdateArtistProfile } from '@/types/artist.interface'

class ArtistService {
	async getArtistById(id: string) {
		return await axiosDefault({
			url: API_URL.artists.getById(id),
			method: 'GET',
		})
	}

	async becomeArtist() {
		return await axiosWithAuth({
			url: API_URL.artists.becomeArtist(),
			method: 'POST',
		})
	}

	async updateProfile(data: IUpdateArtistProfile) {
		return await axiosWithAuth({
			url: API_URL.artists.updateProfile(),
			method: 'PATCH',
			data,
		})
	}

	async updateProfileImage(imageFile: File) {
		const formData = new FormData()
		formData.append('artist-avatar', imageFile)

		return await axiosWithAuth({
			url: API_URL.artists.updateImageProfile(),
			method: 'PATCH',
			data: formData,
		})
	}
}

export const artistService = new ArtistService()
