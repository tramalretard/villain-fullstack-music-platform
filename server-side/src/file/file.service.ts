import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; name: string }> {
    const uploadFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadFolder);

    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${Date.now()}.${fileExtension}`;

    await writeFile(`${uploadFolder}/${newFileName}`, file.buffer);

    const response = {
      url: `/uploads/${folder}/${newFileName}`,
      name: newFileName,
    };

    return response;
  }
}
