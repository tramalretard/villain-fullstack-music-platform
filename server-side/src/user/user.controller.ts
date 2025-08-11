import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from './decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() dto: UserDto) {
    return await this.userService.createUserService(dto);
  }

  @Auth()
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, file);
  }
}
