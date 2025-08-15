import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from './decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не был предоставлен в поле "avatar"');
    }

    return this.userService.updateAvatarService(userId, file);
  }
}
