import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { hash } from 'argon2';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createUserService(dto: UserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: await hash(dto.password),
      },
    });
  }

  async getUserByIdService(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmailService(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateAvatarService(userId: string, avatarFile: Express.Multer.File) {
    const { url } = await this.fileService.saveFile(avatarFile, 'avatars');

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
      select: { avatar: true },
    });
  }
}
