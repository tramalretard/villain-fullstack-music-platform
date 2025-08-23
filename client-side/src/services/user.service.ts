import { getContentType } from '@/api/api.helper'
import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'

class UserService {
	async updateAvatar(file: File) {
		const formData = new FormData()
		formData.append('avatar', file)

		const { data: updateAvatar } = await axiosWithAuth({
			url: API_URL.users.updateAvatar(),
			method: 'PATCH',
			data: formData,
		})

		return updateAvatar
	}
}

export const userService = new UserService()
