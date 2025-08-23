import { axiosWithAuth } from '@/api/api.interceptors'
import { API_URL } from '@/config/api.constants'
import { IFile } from '@/types/file.interface'

class FileService {
	async uploadFile(file: File, folder?: string): Promise<IFile> {
		const formData = new FormData()
		formData.append('file', file)

		const { data } = await axiosWithAuth<IFile>({
			url: API_URL.files.upload(),
			method: 'POST',
			data: formData,
			params: {
				folder,
			},
		})

		return data
	}
}

export const fileService = new FileService()
