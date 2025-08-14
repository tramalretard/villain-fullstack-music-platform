import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from 'prisma/generated';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getPublicProfileService(artistId: string) {
    const artist = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
      include: {
        tracks: { orderBy: { createdAt: 'desc' }, take: 10 },
        albums: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!artist) {
      throw new NotFoundException('Профиль артиста не найден');
    }

    return artist;
  }

  async becomeArtistService(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Пользователь не найден');

    if (user.role === UserRole.ARTIST) {
      throw new ConflictException('Вы уже являетесь артистом');
    }

    return this.prisma.$transaction([
      this.prisma.artistProfile.create({
        data: {
          userId: userId,
          displayName: user.name,
        },
      }),

      this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.ARTIST },
      }),
    ]);
  }

  async updateProfileService(userId: string, dto: UpdateArtistDto) {
    return this.prisma.artistProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async updateProfileImageService(
    userId: string,
    imageFile: Express.Multer.File,
  ) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { userId },
    });

    if (!artistProfile) {
      throw new ForbiddenException('Профиль артиста не найден');
    }

    const { url } = await this.fileService.saveFile(
      imageFile,
      'artist-profiles',
    );

    return this.prisma.artistProfile.update({
      where: { userId },
      data: { imageSrc: url },
      select: { imageSrc: true },
    });
  }
}
